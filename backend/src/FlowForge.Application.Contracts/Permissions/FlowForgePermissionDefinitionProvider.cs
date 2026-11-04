using FlowForge.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace FlowForge.Permissions;

public class FlowForgePermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(FlowForgePermissions.GroupName);

        // Define permissions here as features are added.
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<FlowForgeResource>(name);
    }
}
