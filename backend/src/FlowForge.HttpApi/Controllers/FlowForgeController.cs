using FlowForge.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace FlowForge.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class FlowForgeController : AbpControllerBase
{
    protected FlowForgeController()
    {
        LocalizationResource = typeof(FlowForgeResource);
    }
}
