using System.Security.Claims;
using System.Threading.Tasks;
using FlowForge.Controllers.Bff;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using Shouldly;
using Volo.Abp.Account;
using Xunit;
using AbpIdentityUser = Volo.Abp.Identity.IdentityUser;

namespace FlowForge.Controllers;

public class BffAuthControllerTests
{
    private readonly IAntiforgery _antiforgery;
    private readonly SignInManager<AbpIdentityUser> _signInManager;
    private readonly IAccountAppService _accountAppService;
    private readonly BffAuthController _controller;
    private readonly DefaultHttpContext _httpContext;

    public BffAuthControllerTests()
    {
        _antiforgery = Substitute.For<IAntiforgery>();

        // Create mock for SignInManager
        var userStore = Substitute.For<IUserStore<AbpIdentityUser>>();
        var userManager = Substitute.For<UserManager<AbpIdentityUser>>(
            userStore, null, null, null, null, null, null, null, null);
        var contextAccessor = Substitute.For<IHttpContextAccessor>();
        var claimsFactory = Substitute.For<IUserClaimsPrincipalFactory<AbpIdentityUser>>();

        _signInManager = Substitute.For<SignInManager<AbpIdentityUser>>(
            userManager, contextAccessor, claimsFactory, null, null, null, null);

        _accountAppService = Substitute.For<IAccountAppService>();

        _controller = new BffAuthController(_antiforgery, _signInManager, _accountAppService);

        _httpContext = new DefaultHttpContext();
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = _httpContext
        };
    }

    [Fact]
    public void GetCsrfToken_Should_Set_NoStore_And_Return_Token()
    {
        // Arrange
        var tokens = new AntiforgeryTokenSet("request-token", "cookie-token", "formField", "headerName");
        _antiforgery.GetAndStoreTokens(Arg.Any<HttpContext>()).Returns(tokens);

        // Act
        var result = _controller.GetCsrfToken() as OkObjectResult;

        // Assert
        result.ShouldNotBeNull();
        _httpContext.Response.Headers.CacheControl.ToString().ShouldBe("no-store");
        result.Value.ShouldNotBeNull();
    }

    [Fact]
    public async Task Login_With_Invalid_Csrf_Should_Return_BadRequest()
    {
        // Arrange
        _antiforgery.ValidateRequestAsync(Arg.Any<HttpContext>())
            .ThrowsAsync(new AntiforgeryValidationException("CSRF mismatch"));
        var request = new BffLoginRequest { UserName = "admin", Password = "123" };

        // Act
        var result = await _controller.Login(request);

        // Assert
        var badRequest = result.ShouldBeOfType<BadRequestObjectResult>();
        badRequest.StatusCode.ShouldBe(400);
    }

    [Fact]
    public async Task Login_When_Credentials_Failed_Should_Return_Unauthorized()
    {
        // Arrange
        _antiforgery.ValidateRequestAsync(Arg.Any<HttpContext>()).Returns(Task.CompletedTask);
        _signInManager.PasswordSignInAsync("admin", "wrong", false, true)
            .Returns(Microsoft.AspNetCore.Identity.SignInResult.Failed);

        var request = new BffLoginRequest { UserName = "admin", Password = "wrong", RememberMe = false };

        // Act
        var result = await _controller.Login(request);

        // Assert
        var unauthorized = result.ShouldBeOfType<UnauthorizedObjectResult>();
        unauthorized.StatusCode.ShouldBe(401);
    }

    [Fact]
    public async Task Login_When_Credentials_Succeed_Should_Return_Ok()
    {
        // Arrange
        _antiforgery.ValidateRequestAsync(Arg.Any<HttpContext>()).Returns(Task.CompletedTask);
        _signInManager.PasswordSignInAsync("admin", "valid123*", false, true)
            .Returns(Microsoft.AspNetCore.Identity.SignInResult.Success);

        var request = new BffLoginRequest { UserName = "admin", Password = "valid123*", RememberMe = false };

        // Act
        var result = await _controller.Login(request);

        // Assert
        var okResult = result.ShouldBeOfType<OkObjectResult>();
        okResult.StatusCode.ShouldBe(200);
    }

    [Fact]
    public async Task Me_When_Unauthenticated_Should_Return_401()
    {
        // Arrange: unauthenticated user
        _httpContext.User = new ClaimsPrincipal(new ClaimsIdentity());

        var authService = Substitute.For<IAuthenticationService>();
        authService.AuthenticateAsync(_httpContext, IdentityConstants.ApplicationScheme)
            .Returns(AuthenticateResult.Fail("No session"));

        var services = Substitute.For<System.IServiceProvider>();
        services.GetService(typeof(IAuthenticationService)).Returns(authService);
        _httpContext.RequestServices = services;

        // Act
        var result = await _controller.Me();

        // Assert
        result.ShouldBeOfType<UnauthorizedObjectResult>();
        _httpContext.Response.Headers.CacheControl.ToString().ShouldBe("no-store");
    }

    [Fact]
    public async Task Me_When_Authenticated_Should_Return_User_Details()
    {
        // Arrange: authenticated identity
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "user-42"),
            new Claim(ClaimTypes.Name, "flowforge-admin")
        };
        var identity = new ClaimsIdentity(claims, IdentityConstants.ApplicationScheme);
        var principal = new ClaimsPrincipal(identity);
        _httpContext.User = principal;

        var authService = Substitute.For<IAuthenticationService>();
        authService.AuthenticateAsync(_httpContext, IdentityConstants.ApplicationScheme)
            .Returns(AuthenticateResult.Success(new AuthenticationTicket(principal, IdentityConstants.ApplicationScheme)));

        var services = Substitute.For<System.IServiceProvider>();
        services.GetService(typeof(IAuthenticationService)).Returns(authService);
        _httpContext.RequestServices = services;

        // Act
        var result = await _controller.Me() as OkObjectResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(200);
    }

    [Fact]
    public async Task Logout_With_Invalid_Csrf_Should_Return_BadRequest()
    {
        // Arrange
        _antiforgery.ValidateRequestAsync(Arg.Any<HttpContext>())
            .ThrowsAsync(new AntiforgeryValidationException("CSRF mismatch"));

        // Act
        var result = await _controller.Logout("invalid-token");

        // Assert
        var badRequest = result.ShouldBeOfType<BadRequestObjectResult>();
        badRequest.StatusCode.ShouldBe(400);
    }

    [Fact]
    public async Task Logout_When_Unauthenticated_Should_Return_401()
    {
        // Arrange
        _antiforgery.ValidateRequestAsync(Arg.Any<HttpContext>()).Returns(Task.CompletedTask);

        var authService = Substitute.For<IAuthenticationService>();
        authService.AuthenticateAsync(_httpContext, IdentityConstants.ApplicationScheme)
            .Returns(AuthenticateResult.Fail("Not signed in"));

        var services = Substitute.For<System.IServiceProvider>();
        services.GetService(typeof(IAuthenticationService)).Returns(authService);
        _httpContext.RequestServices = services;

        // Act
        var result = await _controller.Logout("valid-token");

        // Assert
        var unauthorized = result.ShouldBeOfType<UnauthorizedObjectResult>();
        unauthorized.StatusCode.ShouldBe(401);
    }

    [Fact]
    public async Task Logout_When_Authenticated_Should_SignOut_And_Return_NoContent()
    {
        // Arrange
        _antiforgery.ValidateRequestAsync(Arg.Any<HttpContext>()).Returns(Task.CompletedTask);

        var identity = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "admin") }, IdentityConstants.ApplicationScheme);
        var principal = new ClaimsPrincipal(identity);

        var authService = Substitute.For<IAuthenticationService>();
        authService.AuthenticateAsync(_httpContext, IdentityConstants.ApplicationScheme)
            .Returns(AuthenticateResult.Success(new AuthenticationTicket(principal, IdentityConstants.ApplicationScheme)));

        var services = Substitute.For<System.IServiceProvider>();
        services.GetService(typeof(IAuthenticationService)).Returns(authService);
        _httpContext.RequestServices = services;

        // Act
        var result = await _controller.Logout("valid-token");

        // Assert
        result.ShouldBeOfType<NoContentResult>();
        await _signInManager.Received(1).SignOutAsync();
        _httpContext.Response.Headers.CacheControl.ToString().ShouldBe("no-store");
    }
}
