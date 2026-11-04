using Volo.Abp.Modularity;

namespace FlowForge;

/* Inherit from this class for your domain layer tests. */
public abstract class FlowForgeDomainTestBase<TStartupModule> : FlowForgeTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
