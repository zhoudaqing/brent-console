
package cn.brent.console.webapp.model;

import com.jfinal.plugin.activerecord.Model;

/**
 * <p>实体类- </p>
 * <p>Table: sys_user_role </p>
 *
 * @since 2015-08-18 05:00:41
 */
public class SysUserRole extends Model<SysUserRole>{

	public static final SysUserRole me = new SysUserRole();

    /**  */
    public static final String RoleCode = "RoleCode";

    /**  */
    public static final String UserName = "UserName";

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