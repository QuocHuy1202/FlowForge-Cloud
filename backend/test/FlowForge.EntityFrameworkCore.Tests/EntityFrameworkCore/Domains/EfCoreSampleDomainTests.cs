using FlowForge.Samples;
using Xunit;

namespace FlowForge.EntityFrameworkCore.Domains;

[Collection(FlowForgeTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<FlowForgeEntityFrameworkCoreTestModule>
{

}
