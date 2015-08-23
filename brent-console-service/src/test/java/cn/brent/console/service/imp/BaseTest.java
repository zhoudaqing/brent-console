package cn.brent.console.service.imp;

import org.junit.BeforeClass;

import cn.brent.bus.util.Prop;
import cn.brent.console.service.model.SysUser;

import com.jfinal.ext.plugin.tablebind.AutoTableBindPlugin;
import com.jfinal.ext.plugin.tablebind.SimpleNameStyles;
import com.jfinal.plugin.druid.DruidPlugin;

public class BaseTest {

	@BeforeClass
	public static void init(){
		Prop pro = new Prop("config.properties");
		
		DruidPlugin druid = new DruidPlugin(pro.get("jdbcUrl"),pro.get("user"), pro.get("password").trim());
		
		druid.start();

		AutoTableBindPlugin atb=new AutoTableBindPlugin(druid,SimpleNameStyles.UP_UNDERLINE);
		
		atb.addMapping("sys_user", SysUser.class);
		
		atb.start();
	}
}
