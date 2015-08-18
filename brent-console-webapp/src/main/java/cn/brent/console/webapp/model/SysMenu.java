
package cn.brent.console.webapp.model;

import com.jfinal.plugin.activerecord.Model;

/**
 * <p>实体类- </p>
 * <p>Table: sys_menu </p>
 *
 * @since 2015-08-18 04:59:58
 */
public class SysMenu extends Model<SysMenu>{

	public static final SysMenu me = new SysMenu();

    /**  */
    public static final String MenuCode = "MenuCode";

    /**  */
    public static final String ParentCode = "ParentCode";

    /**  */
    public static final String MenuName = "MenuName";

    /** 菜单|功能 */
    public static final String MenuType = "MenuType";

    /**  */
    public static final String Icon = "Icon";

    /**  */
    public static final String Prop1 = "Prop1";

    /**  */
    public static final String Prop2 = "Prop2";

    /**  */
    public static final String Memo = "Memo";

    /**  */
    public static final String AddTime = "AddTime";

    /**  */
    public static final String AddUser = "AddUser";

    /**  */
    public static final String ModifyTime = "ModifyTime";

    /**  */
    public static final String ModifyUser = "ModifyUser";

}