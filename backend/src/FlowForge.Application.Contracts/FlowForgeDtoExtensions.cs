using Volo.Abp.ObjectExtending;
using Volo.Abp.Threading;

namespace FlowForge;

public static class FlowForgeDtoExtensions
{
    private static readonly OneTimeRunner OneTimeRunner = new OneTimeRunner();

    public static void Configure()
    {
        OneTimeRunner.Run(() =>
        {
            // Add extension properties to DTOs from depended modules here.
            // See: https://docs.abp.io/en/abp/latest/Object-Extensions
        });
    }
}
