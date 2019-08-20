export class MiBandGatt{
    public static readonly DEVICE_NAME = "MI Band 2";


    public static readonly UUID_SERVICE_GENERIC_ACCESS = '1800';
    public static readonly UUID_CHARATERISTIC_DEVICE_NAME = '2A00'; //Read
    public static readonly UUID_CHARATERISTIC_APPEARENCE= '2A01';   //Read
    public static readonly UUID_CHARATERISTIC_PREFERRED_CONNECTION = '2A04'; //Read


    public static readonly UUID_SERVICE_GENERIC_ATTRIBUTE = '1801';
    public static readonly UUID_CHARATERISTIC_SERVICE_CHANGED = '2A04'; //Indicate, Read

    public static readonly UUID_SERVICE_DEVICE_INFORMATION = '180A';
    public static readonly UUID_CHARATERISTIC_SERIAL_NUMBER = '2A25'; //Read
    public static readonly UUID_CHARATERISTIC_HW_REVISION = '2A27'; //Read
    public static readonly UUID_CHARATERISTIC_SW_REVISION = '2A28'; //Read
    public static readonly UUID_CHARATERISTIC_SYSTEM_ID = '2A23'; //Read
    public static readonly UUID_CHARATERISTIC_PNP_ID = '2A50'; //Read

    public static readonly UUID_UNKNOWN_SERVICE_1 = '00001530-0000-3512-2118-0009AF100700'


    public static readonly UUID_SERVICE_ALERT_NOTIFICATION = '1811';
    public static readonly UUID_CHARATERISTIC_NEW_ALERT = '2A46'; //Write
    public static readonly UUID_CHARATERISTIC_ALERT_NOTIFICATION_CONTROL_POINT = '2A44'; //Notify, Read, Write

    public static readonly UUID_SERVICE_IMMEDIATE_ALERT = '1802';
    public static readonly UUID_CHARATERISTIC_VIBRATE = '2A06'; //Write No Response

    public static readonly UUID_SERVICE_HART_RATE = '180D';
    public static readonly UUID_CHARATERISTIC_HRM_CONTROL = '2A39' // Read, Write
    public static readonly UUID_CHARATERISTIC_HRM_DATA = '2A37' //Notify

    public static readonly UUID_SERVICE_MIBAND_1 = 'FEE0';
    public static readonly UUID_CHARACTERISTIC_TIME = '2A2B'; //Notify, Read, Write
    public static readonly UUID_CHARACTERISTIC_PERIPHERAL_PREFERRED_CONNECTION = '2A04'; //Notify, Read, Write No Response



    public static readonly UUID_SERVICE_AUTH = 'FEE1';
    public static readonly UUID_CHARACTERISTIC_BATTERY = '00000006-0000-3512-2118-0009AF100700';
    public static readonly UUID_CHARACTERISTIC_STEPS = '00000007-0000-3512-2118-0009AF100700';
    public static readonly UUID_CHARACTERISTIC_USER_INFO = '00000008-0000-3512-2118-0009AF100700';
    public static readonly UUID_CHARACTERISTIC_AUTH = '00000009-0000-3512-2118-0009AF100700';
    public static readonly UUID_CHARATERISTIC_BUTTON_EVENT = '00000010-0000-3512-2118-0009AF100700';




}