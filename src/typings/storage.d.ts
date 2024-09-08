import {localStg} from "@/utils/storage";
/** The storage namespace */
declare namespace StorageType {
  interface Session {
    /** The theme color */
    themeColor: string;
    // /**
    //  * the theme settings
    //  */
    // themeSettings: App.Theme.ThemeSetting;
  }
//   localStg.remove('parse_deviceid')
// }
// localStg.set('avatar', tag.userinfo.avatar)
// localStg.set('name', name)
// localStg.set('nick', nick)
// localStg.set('objectId', objectId)
// localStg.set('deptId', roles[0].objectId)
// localStg.set('rolename', roles[0].name)
// localStg.set('sessionToken', sessionToken)
  interface Local {
    /** The i18n language */
    lang: App.I18n.LangType;
    /** The token */
    name: string;
    sessionToken: string;
    deptId: string;
    rolename: string;
    userobjectId: string;
    nick: string;
    token: string;
    avatar: object;
    parse_deviceid: string;
    /** Fixed sider with mix-menu */
    mixSiderFixed: CommonType.YesOrNo;
    /** The refresh token */
    refreshToken: string;
    /** The theme color */
    themeColor: string;
    /** The theme settings */
    themeSettings: App.Theme.ThemeSetting;
    /**
     * The override theme flags
     *
     * The value is the build time of the project
     */
    overrideThemeFlag: string;
    /** The global tabs */
    globalTabs: App.Global.Tab[];
    /** The backup theme setting before is mobile */
    backupThemeSettingBeforeIsMobile: {
      layout: UnionKey.ThemeLayoutMode;
      siderCollapse: boolean;
    };
  }
}
