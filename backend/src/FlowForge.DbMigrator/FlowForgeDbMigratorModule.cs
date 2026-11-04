using FlowForge.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace FlowForge.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(FlowForgeEntityFrameworkCoreModule),
    typeof(FlowForgeApplicationContractsModule)
)]
public class FlowForgeDbMigratorModule : AbpModule
{
}
