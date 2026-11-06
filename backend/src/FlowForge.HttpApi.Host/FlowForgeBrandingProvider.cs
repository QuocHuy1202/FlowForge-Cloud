using Microsoft.Extensions.Localization;
using FlowForge.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace FlowForge;

[Dependency(ReplaceServices = true)]
public class FlowForgeBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<FlowForgeResource> _localizer;

    public FlowForgeBrandingProvider(IStringLocalizer<FlowForgeResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];

    public override string? LogoUrl => "~/images/logo/flowforge.svg";

    public override string? LogoIconUrl => "~/images/logo/flowforge.svg";
}
