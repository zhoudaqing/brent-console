
package cn.brent.console.webapp.model;

import com.jfinal.plugin.activerecord.Model;

/**
 * <p>实体类- </p>
 * <p>Table: sys_code </p>
 *
 * @since 2015-08-18 04:59:36
 */
public class SysCode extends Model<SysCode>{

	public static final SysCode me = new SysCode();

    /**  */
    public static final String CodeType = "CodeType";

    /**  */
    public static final String ParentCode = "ParentCode";

    /**  */
    public static final String CodeValue = "CodeValue";

    /**  */
    public static final String CodeName = "CodeName";

    /**  */
    public static final String CodeOrder = "CodeOrder";

    /**  */
    public static final String Prop1 = "Prop1";

    /**  */
    public static final String Prop2 = "Prop2";

    /**  */
    public static final String Prop3 = "Prop3";

    /**  */
    public static final String Prop4 = "Prop4";

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