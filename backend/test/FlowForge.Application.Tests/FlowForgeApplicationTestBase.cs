using Volo.Abp.Modularity;

namespace FlowForge;

public abstract class FlowForgeApplicationTestBase<TStartupModule> : FlowForgeTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
