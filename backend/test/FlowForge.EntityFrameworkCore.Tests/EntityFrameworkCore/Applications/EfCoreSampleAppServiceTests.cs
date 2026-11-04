using FlowForge.Samples;
using Xunit;

namespace FlowForge.EntityFrameworkCore.Applications;

[Collection(FlowForgeTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<FlowForgeEntityFrameworkCoreTestModule>
{

}
