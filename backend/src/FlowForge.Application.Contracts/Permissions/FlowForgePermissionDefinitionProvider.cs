using FlowForge.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace FlowForge.Permissions;

public class FlowForgePermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(FlowForgePermissions.GroupName);

        //Define your own permissions here. Example:
        //myGroup.AddPermission(FlowForgePermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<FlowForgeResource>(name);
    }
}
