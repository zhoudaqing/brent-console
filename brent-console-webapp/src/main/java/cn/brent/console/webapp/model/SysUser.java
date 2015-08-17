package cn.brent.console.webapp.model;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

public class SysUser extends Model<SysUser> {
	
	public static String UserName="UserName";
	
    public static final SysUser me = new SysUser();

    // ---------- 后台查询方法 -------
    public Page<SysUser> page(int pageNumber, int pageSize) {
        return super.paginate(pageNumber, pageSize, "select * ", "from user order by in_time desc");
    }

}