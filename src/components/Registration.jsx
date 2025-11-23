import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";

function Registration() {
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = watch("password", "");

  // Update image preview when user selects file
  const imageChangeHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const Submit = async (data) => {
    const toastId = toast.loading("Creating Your Account...");

    try {
      // 1️⃣ Create authenticated user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCred.user;
      const userId = user.uid; // use firebase auth UID

      // 2️⃣ Upload profile picture
      let imageUrl = null;

      if (data.profilePicture && data.profilePicture.length > 0) {
        const file = data.profilePicture[0];
        const imageRef = ref(storage, `profileImages/${uuidv4()}`);

        await uploadBytes(imageRef, file);
        imageUrl = await getDownloadURL(imageRef);
      }

      // 3️⃣ Save user data in Firestore
      await setDoc(doc(db, "users", userId), {
        fullname: data.fullname,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        interests: data.interests || [],
        profilePicture: imageUrl,
        createdAt: new Date(),
      });

      toast.success("Account created successfully!", { id: toastId });
      reset();
      navigate("/login");
    } catch (error) {
      toast.error(error.message, { id: toastId });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center items-center py-10">
      <form
        onSubmit={handleSubmit(Submit)}
        className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-xl shadow-lg w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            {...register("fullname", { required: "Full name is required" })}
            className="w-full p-3 border rounded-md"
            placeholder="James Collins"
          />
          {errors.fullname && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullname.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-3 border rounded-md"
            placeholder="example@mail.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            })}
            className="w-full p-3 border rounded-md"
            placeholder="**********"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === passwordValue || "Passwords do not match",
            })}
            className="w-full p-3 border rounded-md"
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            {...register("phone", { required: "Phone number is required" })}
            className="w-full p-3 border rounded-md"
            placeholder="+234 805 678 9000"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Gender */}
        <div className="mb-4">
          <span className="block font-medium mb-1">Gender</span>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="male"
                {...register("gender", { required: true })}
              />
              Male
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="female"
                {...register("gender", { required: true })}
              />
              Female
            </label>
          </div>

          {errors.gender && (
            <p className="text-red-600 text-sm mt-1">Please select gender</p>
          )}
        </div>

        {/* Interests */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Interests</label>
          <div className="flex flex-wrap gap-4">
            {["sports", "news", "fashion", "travels", "cooking"].map(
              (interest) => (
                <label key={interest} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={interest}
                    {...register("interests")}
                  />
                  <span className="capitalize">{interest}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Profile Picture */}
        <div className="mb-4 mt-4">
          <label className="block font-medium mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            {...register("profilePicture")}
            onChange={imageChangeHandler}
            className="w-full p-3 border rounded-md"
          />

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-32 h-32 object-cover rounded-full"
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
        </div>

        <div>
          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Registration;
