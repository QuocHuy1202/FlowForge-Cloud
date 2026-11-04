using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using FlowForge.Data;
using Volo.Abp.DependencyInjection;

namespace FlowForge.EntityFrameworkCore;

public class EntityFrameworkCoreFlowForgeDbSchemaMigrator
    : IFlowForgeDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreFlowForgeDbSchemaMigrator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolving the FlowForgeDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<FlowForgeDbContext>()
            .Database
            .MigrateAsync();
    }
}
