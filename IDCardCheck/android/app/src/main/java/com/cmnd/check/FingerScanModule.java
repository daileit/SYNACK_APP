package com.cmnd.check;

import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbDeviceConnection;
import android.hardware.usb.UsbInterface;
import android.hardware.usb.UsbManager;
import android.os.Handler;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.io.DataOutputStream;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class FingerScanModule extends ReactContextBaseJavaModule {
    private static final String LENGTH_SHORT = "LENGTH_SHORT";
    private static final String LENGTH_LONG = "LENGTH_LONG";

//    Context ahandle ;
//
//    Bitmap bmpDefaultPic;
//
//    private boolean fpflag=false;
//    private boolean fpcharflag = false;
//    private boolean fpmatchflag = false;
//    private boolean fperoll = false;
//    private boolean fpsearch = false;
//    private boolean isfpon  = false;
//
//    long ssart = System.currentTimeMillis();
//    long ssend = System.currentTimeMillis();
//    private Handler objHandler_fp;
//    //private HandlerThread thread;
//
//    private int testcount = 0;
//    private ZAandroid a6 = new ZAandroid();
//    private int fpcharbuf = 1;
//    private byte[] pTempletbase = new byte[2304];
//    private int IMG_SIZE = 0;//同参数：（0:256x288 1:256x360）
//
//    private String TAG = "zazdemo";
//    private int DEV_ADDR = 0xffffffff;
//    private byte[] pPassword = new byte[4];
//    private Handler objHandler_3 ;
//    private int rootqx = 1;///0 noroot  1root
//    //private int defDeviceType =  2;//zaz060
//    private int defDeviceType =  12;//zaz050
//    private int defiCom = 4;//;
//    private int defiBaud = 6;
//    private boolean isshowbmp = false;
//
//    private int iPageID = 0;
//    //////////////////
//    private int fpcharlen = 512;
//    private int  fpchcount = 2;
//
//
//    public static final int opensuccess = 101;
//    public static final int openfail = 102;
//    public static final int usbfail = 103;


    public FingerScanModule(ReactApplicationContext context){
        super(context);
//        ahandle = context;
//
//
//        objHandler_fp = new Handler();//
//
//        //初始化基本参数
//        rootqx = 1;			//系统权限(0:not root  1:root)
//        defDeviceType=12;	//设备通讯类型(2:usb  1:串口)
//        defiCom= 6;			//设备波特率(1:9600 2:19200 3:38400 4:57600 6:115200  usb无效)
    }

    @Override
    public String getName(){
        return "FingerScanModule";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(LENGTH_SHORT, Toast.LENGTH_SHORT);
        constants.put(LENGTH_LONG, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void showText(String message, int duration) {
        Toast.makeText(getReactApplicationContext(), message, duration).show();
    }


    //---------FingerScan-------

//
//
//
//    @ReactMethod
//    public void connectFingerScanner() {
//        // TODO Auto-generated method stub
//        byte[] pPassword = new byte[4];
//        skipshow("open");
//        Runnable r = new Runnable() {
//            public void run() {
//                isusbfinshed = 3;
//                ZA_finger fppower = new ZA_finger();
//                //fppower.finger_power_on();
//                Sleep(1000);
//                OpenDev();
//            }
//        };
//        Thread s = new Thread(r);
//        s.start();
//    }
//
//    @ReactMethod
//    public void getFingerImg() {
//        // TODO Auto-generated method stub
//        setflag(true);
//        fpflag = false;
////        objHandler_fp.removeCallbacks(fpcharTasks);
////        objHandler_fp.removeCallbacks(fperollTasks);
////        objHandler_fp.removeCallbacks(fpsearchTasks);
//        objHandler_fp.removeCallbacks(fpTasks);
//        readsfpimg();
//    }
//
//    @ReactMethod
//    public void getFingerImg2(String stringArgument, int numberArgument, Callback callback) {
////        // TODO Auto-generated method stub
////        setflag(true);
////        fpflag = false;
//////        objHandler_fp.removeCallbacks(fpcharTasks);
//////        objHandler_fp.removeCallbacks(fperollTasks);
//////        objHandler_fp.removeCallbacks(fpsearchTasks);
////        objHandler_fp.removeCallbacks(fpTasks);
////        readsfpimg();
//        // TODO: Implement some actually useful functionality
//        callback.invoke("Received numberArgument: " + numberArgument + " stringArgument: " + stringArgument);
//    }
//
//	//获取图像
//	public void readsfpimg()
//	{
//		ssart = System.currentTimeMillis();
//		ssend = System.currentTimeMillis();
//		testcount = 0;
//		objHandler_fp.postDelayed(fpTasks, 0);
//	}
//
//	private Runnable fpTasks = new Runnable() {
//		public void run()// 运行该服务执行此函数
//		{
//			String temp="";
//			long st = System.currentTimeMillis();
//			long sd = System.currentTimeMillis();
//			long timecount=0;
//			ssend = System.currentTimeMillis();
//			timecount = (ssend - ssart);
//			if (timecount >10000)
//			{
////				temp =getReactApplicationContext().getString(R.string.readfptimeout_str)+"\r\n";
////				mtvMessage.setText(temp);
//				return;
//			}
//			if(fpflag){
////				temp =getReactApplicationContext().getString(R.string.stopgetimage_str)+"\r\n";
////				mtvMessage.setText(temp);
//				return;
//			}
//			int nRet = 0;
//			st = System.currentTimeMillis();
//			nRet = a6.ZAZGetImage(DEV_ADDR);
//			sd = System.currentTimeMillis();
//			timecount = (sd - st);
////			temp = getReactApplicationContext().getString(R.string.getimagesuccess_str) + "耗时:"+timecount+"ms\r\n";
//			st = System.currentTimeMillis();
//			if(nRet  == 0)
//			{
//				testcount = 0;
//				int[] len = { 0, 0 };
//				byte[] Image = new byte[256 * 360];
//				a6.ZAZUpImage(DEV_ADDR, Image, len);
//				sd = System.currentTimeMillis();
//				timecount = (sd - st);
////				temp += getReactApplicationContext().getString(R.string.upimagesuccess_str) + "耗时:"+timecount+"ms\r\n";
////				mtvMessage.setText(temp);
//
//				String str = "/mnt/sdcard/test.bmp";
//				a6.ZAZImgData2BMP(Image, str);
//				bmpDefaultPic = BitmapFactory.decodeFile(str,null);
////				mFingerprintIv.setImageBitmap(bmpDefaultPic);
//			}
//			else if(nRet==a6.PS_NO_FINGER){
////				temp = getReactApplicationContext().getString(R.string.readingfp_str)+((10000-(ssend - ssart)))/1000 +"."+(1000-(ssend - ssart)%1000) +"s";
////				mtvMessage.setText(temp);
//				objHandler_fp.postDelayed(fpTasks, 100);
//			}
//			else if(nRet==a6.PS_GET_IMG_ERR){
////				temp =getReactApplicationContext().getString(R.string.getimageing_str);
//				Log.d(TAG, temp+"2: "+nRet);
//				objHandler_fp.postDelayed(fpTasks, 100);
////				mtvMessage.setText(temp);
//				return;
//			}else if(nRet == -2)
//			{
//				testcount ++;
//				if(testcount <3){
////					temp = getReactApplicationContext().getString(R.string.readingfp_str)+((10000-(ssend - ssart)))/1000 +"s";
//					isfpon = false;
////					mtvMessage.setText(temp);
//					objHandler_fp.postDelayed(fpTasks, 10);
//				}
//				else{
////					temp =getReactApplicationContext().getString(R.string.Communicationerr_str);
//					Log.d(TAG, temp+": "+nRet);
////					mtvMessage.setText(temp);
//					return;
//				}
//			}
//			else
//			{
////				temp =getReactApplicationContext().getString(R.string.Communicationerr_str);
//				Log.d(TAG, temp+"2: "+nRet);
////				mtvMessage.setText(temp);
//				return;
//			}
//
//		}
//	};
//
//
//    private void setflag(boolean value)
//    {
//        fpflag = value;
//        fpcharflag = value;
//        fpmatchflag= value;
//        fperoll = value;
//        fpsearch = value;
//    }
//
//    private void skipshow(String Str)
//    {
//        Toast.makeText(getReactApplicationContext() ,Str,Toast.LENGTH_SHORT).show();
//
//    }
//
//    private void Sleep(int times)
//    {
//        try {
//            Thread.sleep(times);
//        } catch (InterruptedException e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
//    }
//
//
//    public int isusbfinshed = 0;
//
//    //打开设备
//    private void OpenDev() {
//        // TODO Auto-generated method stub
//        Log.i(TAG,"start Opendev");
//        int status = -1;
//        rootqx = 1;
//        if( 1 == rootqx){
//            //	skipshow("tryusbroot");
//            Log.i(TAG,"use by root ");
//            LongDunD8800_CheckEuq();
//            status = a6.ZAZOpenDevice(-1, 12, defiCom, defiBaud, 0, 0);
//            Log.i(TAG,"status =  "+status + "  (1:success other：error)");
//            if(status == 0 ){
//                status = a6.ZAZVfyPwd(DEV_ADDR, pPassword) ;
//                a6.ZAZSetImageSize(IMG_SIZE);
//            }
//            else{
//                rootqx = 0;
//            }
//        }
//
//        //if(false)
//        if( 0 == rootqx)
//        {
//            Log.i(TAG,"use by not root ");
//            device = null;
//            isusbfinshed  = 0;
//            int fd = 0;
//            defDeviceType = 12;
//            isusbfinshed = getrwusbdevices();
//            //skipshow("watting a time");
//            Log.i(TAG,"waiting user put root ");
//            if(WaitForInterfaces() == false)  {
////				m_fEvent.sendMessage(m_fEvent.obtainMessage(usbfail, R.id.btnopen, 0));
//                return;
//            }
//            fd = OpenDeviceInterfaces();
//            if(fd == -1)
//            {
////				m_fEvent.sendMessage(m_fEvent.obtainMessage(usbfail, R.id.btnopen, 0));
//                return;
//            }
//            Log.e(TAG, "open fd: " + fd);
//            status = a6.ZAZOpenDevice(fd, defDeviceType, defiCom, defiBaud, 0, 0);
//            Log.e("ZAZOpenDeviceEx",""+defDeviceType +"  "+defiCom+"   "+defiBaud +"  status "+status);
//            if(status == 0 ){
//                status = a6.ZAZVfyPwd(DEV_ADDR, pPassword) ;
//                a6.ZAZSetImageSize(IMG_SIZE);
//            }
//        }
//        Log.e(TAG, " open status: " + status);
//        if(status == 0){
////			m_fEvent.sendMessage(m_fEvent.obtainMessage(opensuccess, R.id.btnopen, 0)  );
//        }
//        else{
////			m_fEvent.sendMessage(m_fEvent.obtainMessage(openfail, R.id.btnopen, 0));
//            if(defDeviceType == 2)
//                defDeviceType =5;
//            else if(defDeviceType ==5)
//                defDeviceType =12;
//            else if(defDeviceType ==12)
//                defDeviceType =15;
//            else
//                defDeviceType =2;
//        }
//    }
//
//
//    public int LongDunD8800_CheckEuq()
//    {
//        Process process = null;
//        DataOutputStream os = null;
//
//        // for (int i = 0; i < 10; i++)
//        // {
//        String path = "/dev/bus/usb/00*/*";
//        String path1 = "/dev/bus/usb/00*/*";
//        File fpath = new File(path);
//        Log.d("*** LongDun D8800 ***", " check path:" + path);
//        // if (fpath.exists())
//        // {
//        String command = "chmod 777 " + path;
//        String command1 = "chmod 777 " + path1;
//        Log.d("*** LongDun D8800 ***", " exec command:" + command);
//        try
//        {
//            process = Runtime.getRuntime().exec("su");
//            os = new DataOutputStream(process.getOutputStream());
//            os.writeBytes(command+"\n");
//            os.writeBytes("exit\n");
//            os.flush();
//            process.waitFor();
//            return 1;
//        }
//        catch (Exception e)
//        {
//            Log.d("*** DEBUG ***", "Unexpected error - Here is what I know: "+e.getMessage());
//        }
//        //  }
//        //  }
//        return 0;
//    }
//
//
//
//    private UsbManager mDevManager = null;
//    private PendingIntent permissionIntent = null;
//    private UsbInterface intf = null;
//    private UsbDeviceConnection connection = null;
//    private UsbDevice device = null;
////    public int isusbfinshed = 0;
//    private static final String ACTION_USB_PERMISSION = "com.android.example.USB_PERMISSION";
//    public int getrwusbdevices() {
//
//        mDevManager = ((UsbManager) ahandle.getSystemService(Context.USB_SERVICE));
//        permissionIntent = PendingIntent.getBroadcast(ahandle, 0, new Intent(ACTION_USB_PERMISSION), 0);
//        IntentFilter filter = new IntentFilter(ACTION_USB_PERMISSION);
//        ahandle.registerReceiver(mUsbReceiver, filter);
//        //this.registerReceiver(mUsbReceiver, new IntentFilter(UsbManager.ACTION_USB_DEVICE_DETACHED));
//        HashMap<String, UsbDevice> deviceList = mDevManager.getDeviceList();
//        if (true) Log.e(TAG, "news:" + "mDevManager");
//
//
//        for (UsbDevice tdevice : deviceList.values()) {
//            Log.i(TAG,	tdevice.getDeviceName() + " "+ Integer.toHexString(tdevice.getVendorId()) + " "
//                    + Integer.toHexString(tdevice.getProductId()));
//            if (tdevice.getVendorId() == 0x2109 && (tdevice.getProductId() == 0x7638))
//            {
//                Log.e(TAG, " 指纹设备准备好了 ");
//                mDevManager.requestPermission(tdevice, permissionIntent);
//                return 1;
//            }
//        }
//        Log.e(TAG, "news:" + "mDevManager  end");
//        return 2;
//    }
//
//    private final BroadcastReceiver mUsbReceiver = new BroadcastReceiver() {
//        public void onReceive(Context context, Intent intent) {
//            context.unregisterReceiver(mUsbReceiver);
//            isusbfinshed = 0;
//            String action = intent.getAction();
//            if (ACTION_USB_PERMISSION.equals(action)) {
//                synchronized (context) {
//                    device = (UsbDevice) intent	.getParcelableExtra(UsbManager.EXTRA_DEVICE);
//                    Log.e("BroadcastReceiver","3333");
//                    if (intent.getBooleanExtra(UsbManager.EXTRA_PERMISSION_GRANTED, false)) {
//                        if (device != null) {
//                            if (true) Log.e(TAG, "Authorize permission " + device);
//                            isusbfinshed = 1;
//                        }
//                    }
//                    else {
//                        if (true) Log.e(TAG, "permission denied for device " + device);
//                        device=null;
//                        isusbfinshed = 2;
//
//                    }
//                }
//            }
//        }
//    };
//
//    public boolean WaitForInterfaces() {
//        int i =0;
//        while (device==null || isusbfinshed == 0) {
//            i++;
//            try {
//                Thread.sleep(10);
//            } catch (InterruptedException e){
//
//            }
//            if(i>2000){
//                isusbfinshed = 2;break;
//            }
//            if(isusbfinshed == 2)break;
//            if(isusbfinshed == 3)break;
//        }
//        if(isusbfinshed == 2)
//            return false;
//        if(isusbfinshed == 3)
//            return false;
//        return true;
//    }
//
//    public int OpenDeviceInterfaces() {
//        UsbDevice mDevice = device;
//        Log.d(TAG, "setDevice " + mDevice);
//        int fd = -1;
//        if (mDevice == null) return -1;
//        connection = mDevManager.openDevice(mDevice);
//        if (!connection.claimInterface(mDevice.getInterface(0), true)) return -1;
//
//        if (mDevice.getInterfaceCount() < 1) return -1;
//        intf = mDevice.getInterface(0);
//
//        if (intf.getEndpointCount() == 0) 	return -1;
//
//        if ((connection != null)) {
//            if (true) Log.e(TAG, "open connection success!");
//            fd = connection.getFileDescriptor();
//            return fd;
//        }
//        else {
//            if (true) Log.e(TAG, "finger device open connection FAIL");
//            return -1;
//        }
//    }


}
