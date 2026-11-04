using System.Threading.Tasks;

namespace FlowForge.Data;

public interface IFlowForgeDbSchemaMigrator
{
    Task MigrateAsync();
}
