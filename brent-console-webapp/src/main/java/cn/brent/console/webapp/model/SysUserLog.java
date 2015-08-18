
package cn.brent.console.webapp.model;

import com.jfinal.plugin.activerecord.Model;

/**
 * <p>实体类- </p>
 * <p>Table: sys_user_log </p>
 *
 * @since 2015-08-18 05:00:36
 */
public class SysUserLog extends Model<SysUserLog>{

	public static final SysUserLog me = new SysUserLog();

    /**  */
    public static final String LogID = "LogID";

    /**  */
    public static final String UserName = "UserName";

    /**  */
    public static final String IP = "IP";

    /**  */
    public static final String LogType = "LogType";

    /**  */
    public static final String SubType = "SubType";

    /**  */
    public static final String LogMessage = "LogMessage";

    /**  */
    public static final String Memo = "Memo";

    /**  */
    public static final String AddTime = "AddTime";

}