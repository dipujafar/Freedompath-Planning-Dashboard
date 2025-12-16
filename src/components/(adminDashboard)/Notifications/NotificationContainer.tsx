"use client";;
import moment from "moment";
import { Bell, Trash2 } from "lucide-react";

const notificationData = [
  {
    message:
      "A new user account has been successfully created. You can now review their details in the user.",
    description: "User account has been created successfully",
    time: "Mon Apr 07 2025 22:00:00 GMT+0000",
  },
  {
    message: "The user profile has been updated with new contact information and preferences.",
    description: "Your information has been updated successfully",
    time: "Mon Apr 07 2025 22:00:00 GMT+0000",
  },
  {
    message: "A new vendor profile had submitted new service for approval. Review their details and verify.",
    description: "Vendor has submitted new service for approval",
    time: "Mon Apr 07 2025 22:00:00 GMT+0000",
  },
];

const NotificationContainer = () => {



  return (
    <div>
      <div className="min-h-[80vh]  p-7">
        <h1 className="text-2xl text-text-color  mb-2">Notifications</h1>
        <hr />

        {/* yesterday notification  */}
        <div className="xl:mt-8 mt-6 xl:px-10 px-6 text-text-color">
          {/* showing today notification */}
          <div className="space-y-5">
            {notificationData?.map((notification, index) => (
              <div className="flex items-center gap-x-4">
                <div className="bg-main-color size-10 flex justify-center items-center rounded-full cursor-pointer">
                  <Bell color="white"/>
                </div>
                <div
                  key={index}
                  className="bg-white border border-gray-400 rounded-lg p-3 flex-1"
                >
                  <div className="flex justify-between gap-x-2 items-center">
                    <h5 className="font-medium text-xl">
                      {notification?.message}
                    </h5>
                    <p>{moment(notification?.time).fromNow()}</p>
                  </div>
                  <p className="text-gray-500">{notification?.description}</p>
                </div>
                {/* delete option */}
                <div className="bg-[#D30000]/30 size-10 flex justify-center items-center rounded-full cursor-pointer">
                  <Trash2 color="#D30000"></Trash2>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="mt-5 grid grid-cols-1 gap-8">
          {currentNotifications.map((notification, inx) => (
            <div key={inx} className="flex gap-4 items-center">
              <div className="bg-[#FFFFFF] p-2 rounded">
                <MdOutlineNotificationsNone
                  size={28}
                  color="var(--color-main)"
                />
              </div>
              <div className=" text-text-color">
                <h4 className="text-lg font-medium ">
                  {notification.message} from {notification?.name}
                </h4>
                <p>{notification.time}</p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
      {/* pagination */}
      {/* <div className="w-max mt-3 ml-auto">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={notificationData.length}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false} // Disable page size changer if unnecessary
        />
      </div> */}
    </div>
  );
};

export default NotificationContainer;
