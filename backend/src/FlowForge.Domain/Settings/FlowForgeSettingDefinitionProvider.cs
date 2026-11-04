using Volo.Abp.Settings;

namespace FlowForge.Settings;

public class FlowForgeSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(FlowForgeSettings.MySetting1));
    }
}
