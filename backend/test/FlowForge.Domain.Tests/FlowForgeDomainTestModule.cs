using Volo.Abp.Modularity;

namespace FlowForge;

[DependsOn(
    typeof(FlowForgeDomainModule),
    typeof(FlowForgeTestBaseModule)
)]
public class FlowForgeDomainTestModule : AbpModule
{

}
