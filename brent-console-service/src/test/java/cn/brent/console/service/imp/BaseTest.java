package cn.brent.console.service.imp;

import org.junit.BeforeClass;

import cn.brent.console.service.StartService;

public class BaseTest {

	@BeforeClass
	public static void init(){
		StartService.init();
	}
}
