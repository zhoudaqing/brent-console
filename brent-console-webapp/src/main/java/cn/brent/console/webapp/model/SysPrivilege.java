
package cn.brent.console.webapp.model;

import com.jfinal.plugin.activerecord.Model;

/**
 * <p>实体类- </p>
 * <p>Table: sys_privilege </p>
 *
 * @since 2015-08-18 05:00:09
 */
public class SysPrivilege extends Model<SysPrivilege>{

	public static final SysPrivilege me = new SysPrivilege();

    /**  */
    public static final String Owner = "Owner";

    /**  */
    public static final String OwnerType = "OwnerType";

    /**  */
    public static final String Privs = "Privs";

    /**  */
    public static final String AddTime = "AddTime";

    /**  */
    public static final String AddUser = "AddUser";

    /**  */
    public static final String ModifyTime = "ModifyTime";

    /**  */
    public static final String ModifyUser = "ModifyUser";

}