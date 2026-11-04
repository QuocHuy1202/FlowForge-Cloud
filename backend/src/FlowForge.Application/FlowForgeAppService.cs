using FlowForge.Localization;
using Volo.Abp.Application.Services;

namespace FlowForge;

/* Inherit your application services from this class.
 */
public abstract class FlowForgeAppService : ApplicationService
{
    protected FlowForgeAppService()
    {
        LocalizationResource = typeof(FlowForgeResource);
    }
}
