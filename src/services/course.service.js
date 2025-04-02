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
    
    // Đảm bảo dữ liệu gửi đi đúng định dạng theo yêu cầu của BE
    const courseRequest = {
      courseName: courseData.courseName,
      courseCategory: courseData.courseCategory, // Đây là categoryId
      description: courseData.description || "",
      price: Number(courseData.price)
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

// Delete Course API
export const deleteCourse = async (courseId) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    if (!courseId) {
      throw new Error("ID khóa học không được để trống");
    }

    console.log("Đang gọi API xóa khóa học với ID:", courseId);
    
    // Đảm bảo courseId được truyền vào đúng vị trí thay vì chuỗi cố định "id"
    const response = await apiClient.delete(`${COURSE_ENDPOINT}/delete-course/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("Response từ API xóa:", response);
    
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa khóa học:", error);
    throw error;
  }
};

// Ví dụ xóa khóa học có ID: "0AA77A49-CAFF-4F01-B"
const handleDelete = async (courseId) => {
  try {
    console.log("ID khóa học cần xóa:", courseId); // Log để kiểm tra
    await deleteCourse(courseId);
    alert("Xóa khóa học thành công!");
    // Refresh lại danh sách
    fetchCourses();
  } catch (error) {
    alert("Lỗi khi xóa: " + error.message);
  }
};

// Update Course API
export const updateCourse = async (courseData) => {
  try {
    // Kiểm tra người dùng đã đăng nhập qua token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    if (!courseData.courseId) {
      throw new Error("ID khóa học không được để trống");
    }

    console.log("Calling API to update course with data:", courseData);
    
    // Đảm bảo dữ liệu gửi đi đúng định dạng
    const courseRequest = {
      courseId: courseData.courseId,
      courseName: courseData.courseName,
      courseCategory: courseData.courseCategory, // Đây là categoryId
      price: Number(courseData.price),
      description: courseData.description || "",
      videoUrl: courseData.videoUrl || "",
      image: courseData.image || "",
    };

    // Kiểm tra request không được null
    if (!courseRequest.courseName || !courseRequest.courseCategory || !courseRequest.price) {
      throw new Error("Vui lòng điền đầy đủ thông tin khóa học");
    }

    console.log("Sending course update request:", courseRequest);
    try {
      const response = await apiClient.put(`${COURSE_ENDPOINT}/update-course/${courseData.courseId}`, courseRequest, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("Update course API response:", response.data);
      return response.data;
    } catch (apiError) {
      console.error("API error:", apiError);
      if (apiError.response) {
        console.error("Error response status:", apiError.response.status);
        console.error("Error response data:", apiError.response.data);
        
        // Trả về lỗi có cấu trúc để client xử lý dễ dàng hơn
        throw {
          message: apiError.response.data?.message || "Lỗi từ server khi cập nhật khóa học",
          status: apiError.response.status,
          data: apiError.response.data
        };
      }
      throw apiError; // Re-throw lỗi nếu không phải lỗi response
    }
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

// Lấy danh sách khóa học theo master
export const getAllCoursesByMaster = async () => {
  try {
    // Kiểm tra người dùng đã đăng nhập qua token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    console.log("Gọi API để lấy tất cả khóa học theo master");
    const response = await apiClient.get(`${COURSE_ENDPOINT}/get-all-course-by-master`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("Raw API response status:", response.status);
    console.log("API response data:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học theo master:", error);
    throw error;
  }
};
