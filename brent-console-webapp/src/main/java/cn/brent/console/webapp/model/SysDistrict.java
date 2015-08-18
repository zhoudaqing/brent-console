
package cn.brent.console.webapp.model;

import com.jfinal.plugin.activerecord.Model;

/**
 * <p>实体类- </p>
 * <p>Table: sys_district </p>
 *
 * @since 2015-08-18 04:59:48
 */
public class SysDistrict extends Model<SysDistrict>{

	public static final SysDistrict me = new SysDistrict();

    /**  */
    public static final String Code = "Code";

    /**  */
    public static final String Name = "Name";

    /**  */
    public static final String CodeOrder = "CodeOrder";

    /**  */
    public static final String TreeLevel = "TreeLevel";

    /**  */
    public static final String Type = "Type";

}