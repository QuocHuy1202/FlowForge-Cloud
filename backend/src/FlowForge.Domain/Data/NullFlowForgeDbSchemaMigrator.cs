using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace FlowForge.Data;

/* This is used if database provider does't define
 * IFlowForgeDbSchemaMigrator implementation.
 */
public class NullFlowForgeDbSchemaMigrator : IFlowForgeDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
