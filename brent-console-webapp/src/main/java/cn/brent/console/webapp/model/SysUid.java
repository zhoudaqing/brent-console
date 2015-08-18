
package cn.brent.console.webapp.model;

import com.jfinal.plugin.activerecord.Model;

/**
 * <p>实体类- </p>
 * <p>Table: sys_uid </p>
 *
 * @since 2015-08-18 05:00:22
 */
public class SysUid extends Model<SysUid>{

	public static final SysUid me = new SysUid();

    /**  */
    public static final String UID = "UID";

    /**  */
    public static final String CreateSYS = "CreateSYS";

    /**  */
    public static final String AddTime = "AddTime";

}