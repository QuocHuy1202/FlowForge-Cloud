using Xunit;

namespace FlowForge.EntityFrameworkCore;

[CollectionDefinition(FlowForgeTestConsts.CollectionDefinitionName)]
public class FlowForgeEntityFrameworkCoreCollection : ICollectionFixture<FlowForgeEntityFrameworkCoreFixture>
{

}
