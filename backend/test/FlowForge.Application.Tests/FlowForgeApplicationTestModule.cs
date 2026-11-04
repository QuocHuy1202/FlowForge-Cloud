using Volo.Abp.Modularity;

namespace FlowForge;

[DependsOn(
    typeof(FlowForgeApplicationModule),
    typeof(FlowForgeDomainTestModule)
)]
public class FlowForgeApplicationTestModule : AbpModule
{

}
