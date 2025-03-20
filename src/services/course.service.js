import apiClient from "./apiClient";

// Constants
const COURSE_ENDPOINT = "/Course";

// Get All Courses API
export const getAllCourses = async () => {
  try {
    console.log("Calling API to get all courses");
    const response = await apiClient.get(`${COURSE_ENDPOINT}/get-all-course`);
    console.log("Raw API response status:", response.status);
    
    // Kiểm tra chi tiết dữ liệu
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      // Log thông tin của phần tử đầu tiên
      const firstItem = response.data.data[0];
      if (firstItem) {
        console.log("First course keys:", Object.keys(firstItem));
        
        // Kiểm tra trường createBy
        console.log("First course createBy:", firstItem.createBy);
        
        // Check các trường liên quan đến tác giả
        ["createBy", "createdBy", "author", "creator", "CreateBy"].forEach(key => {
          console.log(`Checking field ${key}:`, firstItem[key]);
        });
        
        // Check các trường liên quan đến ngày tạo
        console.log("--- Kiểm tra các trường ngày tạo ---");
        ["createAt", "createdAt", "createDate", "createdDate", "CreateAt"].forEach(key => {
          console.log(`Checking date field ${key}:`, firstItem[key]);
          if (firstItem[key]) {
            console.log(`${key} type:`, typeof firstItem[key]);
          }
        });
        
        // Check các trường liên quan đến mã quiz
        console.log("--- Kiểm tra các trường mã quiz ---");
        ["quizId", "QuizId", "quizCode", "QuizCode"].forEach(key => {
          console.log(`Checking quiz field ${key}:`, firstItem[key]);
        });
        
        // Kiểm tra các trường đặc biệt trong hình ảnh DB
        console.log("--- Kiểm tra ID đặc biệt ---");
        const specialIDs = [
          "04205955-C2F9-4FDE-A2E7-BE56EC7E5C3A",
          "33E3FB04-0F4A-41F5-A031-7C34D25D7AA8",
          "y1QwrxpqEM9QM", 
          "1CB074F5-1D02-4BB8-A802-5B8B9A1C98FB",
          "26B871F0-EBC0-4F36-9D69-CCED82742789",
          "8JexUUOPr0baxk",
          "8J7jRVFyoko7vO"
        ];
        
        specialIDs.forEach(id => {
          console.log(`Checking ID ${id}:`, firstItem[id]);
        });
      }
    }
    
    return response.data; // Trả về toàn bộ cấu trúc phản hồi
  } catch (error) {
    console.error("Error fetching all courses:", error);
    throw error;
  }
};

// Create Course API
export const createCourse = async (courseData) => {
  try {
    // Kiểm tra người dùng đã đăng nhập qua token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    console.log("Calling API to create new course with data:", courseData);
    
    // Đảm bảo dữ liệu gửi đi đúng định dạng
    const courseRequest = {
      courseName: courseData.courseName,
      courseCategory: courseData.courseCategory,
      price: Number(courseData.price),
      description: courseData.description || "",
      videoUrl: courseData.videoUrl || "",
      image: courseData.image || "",
      //status: 0  // 0 là Inactive, 1 là Active
    };

    // Kiểm tra request không được null
    if (!courseRequest.courseName || !courseRequest.courseCategory || !courseRequest.price) {
      throw new Error("Vui lòng điền đầy đủ thông tin khóa học");
    }

    console.log("Sending course request:", courseRequest);
    const response = await apiClient.post(`${COURSE_ENDPOINT}/create-course`, courseRequest, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log("Create course API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};
