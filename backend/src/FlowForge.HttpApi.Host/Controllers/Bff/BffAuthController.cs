
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Identity;
using System.Threading.Tasks;
using AbpIdentityUser = Volo.Abp.Identity.IdentityUser;
using Volo.Abp.Account;

namespace FlowForge.Controllers.Bff;

[ApiController]
[Route("api/bff/auth")]
public class BffAuthController : ControllerBase
{
    private readonly IAntiforgery _antiforgery;
    private readonly SignInManager<AbpIdentityUser> _signInManager;
    private readonly IAccountAppService _accountAppService;
    public BffAuthController(
        IAntiforgery antiforgery,
        SignInManager<AbpIdentityUser> signInManager,
        IAccountAppService accountAppService)
    {
        _antiforgery = antiforgery;
        _signInManager = signInManager;
        _accountAppService = accountAppService;
    }

    [HttpGet("csrf")]
    [AllowAnonymous]
    public IActionResult GetCsrfToken()
    {
        Response.Headers.CacheControl = "no-store";

        var tokens = _antiforgery.GetAndStoreTokens(HttpContext);

        return Ok(new
        {
            token = tokens.RequestToken
        });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(
        [FromBody] BffLoginRequest request)
    {
        Response.Headers.CacheControl = "no-store";

        try
        {
            await _antiforgery.ValidateRequestAsync(HttpContext);
        }
        catch (AntiforgeryValidationException)
        {
            return BadRequest(new
            {
                message = "Invalid or missing CSRF token."
            });
        }

        var result = await _signInManager.PasswordSignInAsync(
            request.UserName,
            request.Password,
            request.RememberMe,
            lockoutOnFailure: true
        );

        if (result.IsLockedOut)
        {
            return StatusCode(423, new
            {
                message = "Account temporarily locked."
            });
        }

        if (result.RequiresTwoFactor)
        {
            return StatusCode(409, new
            {
                message = "Two-factor authentication is required."
            });
        }

        if (result.IsNotAllowed)
        {
            return StatusCode(403, new
            {
                message = "Account is not allowed to sign in."
            });
        }

        if (!result.Succeeded)
        {
            return Unauthorized(new
            {
                message = "Invalid username or password."
            });
        }

        return Ok(new
        {
            authenticated = true,
            message = "Login successful."
        });
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(
        [FromBody] BffRegisterRequest request,
        [FromHeader(Name = "X-XSRF-TOKEN")] string csrfToken)
    {
        Response.Headers.CacheControl = "no-store";

        try
        {
            await _antiforgery.ValidateRequestAsync(HttpContext);
        }
        catch (AntiforgeryValidationException)
        {
            return BadRequest(new
            {
                message = "Invalid or missing CSRF token."
            });
        }

        if (request.Password != request.ConfirmPassword)
        {
            return BadRequest(new
            {
                message = "Passwords do not match."
            });
        }

        // ABP enforces the self-registration setting,
        // password policy and default roles.
        var user = await _accountAppService.RegisterAsync(
            new RegisterDto
            {
                AppName = "MVC",
                UserName = request.UserName.Trim(),
                EmailAddress = request.EmailAddress.Trim(),
                Password = request.Password
            }
        );

        return StatusCode(201, new
        {
            message = "Account created successfully.",
            userId = user.Id
        });
    }

    [HttpGet("me")]
    [AllowAnonymous]
    public async Task<IActionResult> Me()
    {
        Response.Headers.CacheControl = "no-store";

        var result = await HttpContext.AuthenticateAsync(
            IdentityConstants.ApplicationScheme
        );

        if (!result.Succeeded ||
            result.Principal?.Identity?.IsAuthenticated != true)
        {
            return Unauthorized(new
            {
                authenticated = false
            });
        }

        var principal = result.Principal;

        return Ok(new
        {
            authenticated = true,
            userId = _signInManager.UserManager
                .GetUserId(principal),
            userName = _signInManager.UserManager
                .GetUserName(principal)
        });
    }
    
    [HttpPost("logout")]
    [AllowAnonymous]
    public async Task<IActionResult> Logout(
        [FromHeader(Name = "X-XSRF-TOKEN")] string csrfToken)
    {
        Response.Headers.CacheControl = "no-store";

        // 1. Validate CSRF token
        try
        {
            await _antiforgery.ValidateRequestAsync(HttpContext);
        }
        catch (AntiforgeryValidationException)
        {
            return BadRequest(new
            {
                message = "Invalid or missing CSRF token."
            });
        }

        // 2. Check the BFF identity cookie explicitly.
        // The default ABP auth scheme may use OpenIddict.
        var authResult = await HttpContext.AuthenticateAsync(
            IdentityConstants.ApplicationScheme
        );

        if (!authResult.Succeeded ||
            authResult.Principal?.Identity?.IsAuthenticated != true)
        {
            return Unauthorized(new
            {
                message = "No active session."
            });
        }

        // 3. Sign out through ASP.NET Core Identity.
        await _signInManager.SignOutAsync();

        // 4. Return a response without caching.
        return NoContent();
    }

}

public sealed class BffLoginRequest
{
    [Required]
    public string UserName { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public bool RememberMe { get; set; }
}

public sealed class BffRegisterRequest
{
    [Required]
    [StringLength(256, MinimumLength = 3)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(256)]
    public string EmailAddress { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string ConfirmPassword { get; set; } = string.Empty;
}
