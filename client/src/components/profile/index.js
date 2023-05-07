import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Modal,
  TextField,
} from "@mui/material";
import LayoutProvider from "components/common/Layout";
import { PhotoCamera } from "@mui/icons-material";
import Loading from "components/common/BtnLoading";
import {
  capitalizeFirstLetter,
  fullNameFormatter,
  nameValidation,
  phoneNumberFormatter,
} from "utils/helper";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DefaultProfile from "../../utils/images/default_profile_pic.png";
import Man4Icon from "@mui/icons-material/Man4";

import "./styles.css";
import { genderOptions } from "utils/constants";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useDocumentTitle from "components/common/useDocumentTitle";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfileData, uploadUserProfilePhoto } from "utils/apis/user";
import { toast } from "react-toastify";
import { setUserData } from "redux/reducer";

function Profile() {
  const editorRef = React.useRef(null);
  const dispatch = useDispatch();
  const state = useSelector((state) => state?.userData?.userData);
  const [modalView, setModalView] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [updateUserData, setUpdateUserData] = React.useState(state);
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const [imageUplaodLoading, setImageUplaodLoading] = React.useState(false);
  const [imageObj, setImageObj] = React.useState(null);

  const handlemodalView = () => setModalView(true);
  const handleClose = () => setModalView(false);

  React.useEffect(() => {
    setUpdateUserData(state);
  }, [state]);

  const uploadImage = async () => {
    setImageUplaodLoading(true);
    let formData = new FormData();
    formData.append("imageUrl", imageObj);
    const { data } = await uploadUserProfilePhoto(formData);
    dispatch(setUserData({ data }));
    setImageObj(null);
    setImageUplaodLoading(false);
    handleClose();
  };

  const setValues = (name, value) => {
    setUpdateUserData({ ...updateUserData, [name]: value });
  };

  const setError = (name) => {
    setErrors({ ...errors, [name]: true });
  };

  const removeError = (name) => {
    const errorObj = errors;
    delete errorObj[name];
    setErrors(errorObj);
  };

  const validateData = async () => {
    if (Object.keys(errors).length !== 0) return false;
    setUpdateLoading(true);
    if (Object.keys(updateUserData).length === 0) {
      return setErrors({
        firstName: true,
        lastName: true,
        phone: true,
        dob: true,
        gender: true,
      });
    }

    const errorObj = {};
    if (!updateUserData?.firstName) errorObj.firstName = true;
    if (!updateUserData?.lastName) errorObj.lastName = true;
    if (!updateUserData?.phone) errorObj.phone = true;
    if (!updateUserData?.dob) errorObj.dob = true;
    if (!updateUserData?.gender) errorObj.gender = true;

    if (Object.keys(errorObj).length !== 0) return setErrors(errorObj);
    else setErrors({});

    const { firstName, lastName, phone, dob, gender } = updateUserData;

    const today = new Date(dob);

    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = mm + "/" + dd + "/" + yyyy;
    const apiBody = {
      firstName,
      lastName,
      phone,
      dob: formattedToday,
      gender,
    };

    const editInfo = await updateUserProfileData(apiBody);
    const { data, status } = editInfo;
    if (status !== 200) toast.error(data?.error);
    else {
      dispatch(setUserData({ data }));
      setUpdateUserData(data);
      toast.success("Profile updated.");
    }
    setUpdateLoading(false);
  };

  const ProfileView = () => {
    const { firstName, lastName, email, phone, dob, gender, image_url } =
      state ?? {};
    return (
      <Card
        sx={{
          maxWidth: "400px",
          minWidth: "fit-content",
          padding: "20px 20px 0 20px",
        }}
      >
        <CardContent
          sx={{
            padding: "0",
            display: { sx: "flex", sm: "flex", md: "block" },
            flexDirection: "column",
            flexWrap: "wrap",
            alignContent: "stretch",
            alignItems: "center",
          }}
        >
          <div className="user_profile_picture">
            <img
              className="user_profile_picture"
              src={image_url}
              alt="your profile"
              width={250}
              height={280}
            />
          </div>

          <div>
            <div className="py-4 px-3 text-xl">
              <span className="sm:text-2xl md:text-3xl text-4xl font-semibold">
                {fullNameFormatter(firstName, lastName)}
              </span>
            </div>
            <div className="block">
              <div className="flex items-center">
                <div className="w-[30px] h-[30px]">
                  <CakeOutlinedIcon color="#1d1f23" />
                </div>
                <span>{dob}</span>
              </div>
              <div className="flex items-center">
                <div className="w-[30px] h-[30px]">
                  <Man4Icon color="#1d1f23" />
                </div>
                <span>{capitalizeFirstLetter(gender)}</span>
              </div>
            </div>
            <div className="block">
              <div className="flex items-center">
                <div className="w-[30px] h-[30px]">
                  <MailOutlineIcon color="#1d1f23" />
                </div>
                <span>{email}</span>
              </div>
              <div className="flex items-center">
                <div className="w-[30px] h-[30px]">
                  <PhoneAndroidOutlinedIcon color="#1d1f23" />
                </div>
                <span>{phoneNumberFormatter(phone)}</span>
              </div>
            </div>

            <div onClick={handlemodalView} className="btn_edit_profile">
              <PhotoCamera sx={{ color: "#393e46" }} /> Upload picture
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const UploadPictureModal = () => {
    return (
      <Modal
        open={modalView}
        onClose={() => {
          setImageObj(null);
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="profile_upload_modal">
          <img
            className="user_profile_picture"
            src={imageObj ? URL.createObjectURL(imageObj) : DefaultProfile}
            ref={editorRef}
            width={"250px"}
            height={"280px"}
            alt="preview"
          />
          <div>
            {imageObj ? (
              <div className="flex mt-4">
                <button className="btn_default mr-2" onClick={uploadImage}>
                  <Loading loading={imageUplaodLoading} width={18} />
                  Upload
                </button>
                <button
                  className="btn_default__cancel"
                  onClick={() => {
                    setImageObj(null);
                    handleClose();
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                disableRipple={true}
              >
                <input
                  hidden
                  accept=".png, .jpg, .jpeg"
                  type="file"
                  onChange={(e) => {
                    e.preventDefault();
                    if (e.target.files[0]?.size / (1024 * 1024) > 5)
                      return toast.error("File size more than 5MB");
                    setImageObj(e.target.files[0]);
                  }}
                />
                <PhotoCamera />
                upload image
              </IconButton>
            )}
          </div>
        </div>
      </Modal>
    );
  };

  const { firstName, lastName, phone, dob, gender } = updateUserData ?? {};

  return (
    <>
      {useDocumentTitle("Profile")}
      <LayoutProvider>
        <div className="sm:block flex justify-around sm:mx-0 md:mx-[40px] mx-0">
          <ProfileView />
          <Card
            sx={{
              minWidth: { xs: "fit-content", sm: "fit-content", md: "60%" },
              maxWidth: "100%",
              padding: "20px 20px 0 20px",
              marginLeft: { xs: "0px", sm: "0px", md: "20px" },
              marginTop: { xs: "20px", sm: "20px", md: "20px" },
              // display: loading ? "flex" : "block",
              display: "block",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* {loading ? (
          <Loading loading={loading} width={50} color="#1c2536" />
        ) : ( */}
            {/* <> */}
            <CardHeader
              title="Profile"
              subheader="The information can be edited"
            />
            <CardContent sx={{ padding: "0" }}>
              <div className="mr-3 w-full ">
                <TextField
                  id="firstName"
                  label="First Name"
                  variant="outlined"
                  error={errors?.firstName}
                  required
                  fullWidth
                  type="text"
                  value={firstName}
                  name="firstName"
                  margin="dense"
                  placeholder="John"
                  helperText={
                    errors?.firstName ? (
                      <span className="text-base flex items-center">
                        <CloseIcon fontSize="small" />
                        Enter a valid First Name
                      </span>
                    ) : (
                      false
                    )
                  }
                  onChange={(e) => {
                    let { name, value } = e.target;
                    if (value === "") setError(name);
                    if (!nameValidation(value)) setError(name);
                    else removeError(name);
                    setValues(name, value);
                  }}
                />
              </div>
              <div className="mr-3 w-full ">
                <TextField
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  error={errors?.lastName}
                  variant="outlined"
                  required
                  fullWidth
                  type="text"
                  margin="dense"
                  value={lastName}
                  placeholder="Doe"
                  helperText={
                    errors?.lastName ? (
                      <span className="text-base flex items-center">
                        <CloseIcon fontSize="small" />
                        Enter a valid Last Name
                      </span>
                    ) : (
                      false
                    )
                  }
                  onChange={(e) => {
                    let { name, value } = e.target;
                    if (value === "") setError(name);
                    if (!nameValidation(value)) setError(name);
                    else removeError(name);
                    setValues(name, value);
                  }}
                />
              </div>

              {/* <div className="mr-3 w-full ">
                <TextField

                  id="email"
                  label="Email"
                  variant="outlined"
                  required
                  type="email"
                  fullWidth
                  margin="dense"
                  value={email ?? ""}
                  name="email"
                  placeholder="johndoe@example.com"
                  helperText={
                    errors?.email ? (
                      <span className="text-base flex items-center">
                        <CloseIcon fontSize="small" />
                        Enter a valid email
                      </span>
                    ) : (
                      false
                    )
                  }
                  error={errors?.email}
                  onChange={(e) => {
                    let { name, value } = e.target;
                    if (value === "") setError(name);
                    if (!emailValidation(value)) setError(name);
                    else removeError(name);
                    setValues(name, value);
                  }}
                />
              </div> */}
              <div className="mr-3 w-full ">
                <TextField
                  id="gender"
                  select
                  label="Select gender"
                  fullWidth
                  required
                  margin="dense"
                  value={gender ?? ""}
                  name="gender"
                  placeholder="select a gender"
                  error={errors?.gender}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    if (value !== "") {
                      setValues(name, value);
                      removeError(name);
                    } else setError(name);
                  }}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                {errors?.gender && (
                  <span className="helperText__gender text-base flex items-center ">
                    <CloseIcon fontSize="small" />
                    Choose a gender
                  </span>
                )}
              </div>

              <div className="mr-3 w-full ">
                <TextField
                  id="phone"
                  label="Phone"
                  variant="outlined"
                  required
                  fullWidth
                  type="phone"
                  margin="dense"
                  name="phone"
                  error={errors?.phone}
                  placeholder="1234567899"
                  value={phone ?? ""}
                  helperText={
                    errors?.phone ? (
                      <span className="text-base flex items-center">
                        <CloseIcon fontSize="small" />
                        Enter a valid phone number
                      </span>
                    ) : (
                      false
                    )
                  }
                  onChange={(e) => {
                    let { name, value } = e.target;
                    if (value === "") setError(name);
                    if (value.length < 10 || value.length > 10) setError(name);
                    else removeError(name);
                    setValues(name, value);
                  }}
                />
              </div>
              <div className="mr-3 w-full ">
                <div className="mt-2">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of birth"
                      disableFuture
                      inputFormat="MM/DD/YYYY"
                      value={dayjs(dob) ?? null}
                      renderInput={(params) => (
                        <TextField
                          required
                          onKeyDown={(e) => e.preventDefault()}
                          error={errors?.dob}
                          helperText={
                            errors?.dob ? (
                              <span className="helperText__dob text-base flex items-center">
                                <CloseIcon fontSize="small" />
                                Enter a valid date
                              </span>
                            ) : (
                              false
                            )
                          }
                          {...params}
                        />
                      )}
                      onChange={(e) => {
                        if (e === null) removeError("dob");
                        setValues("dob", e);
                      }}
                      onError={(e, f) => {
                        if (e === "invalidDate") setError("dob");
                        if (e === null) removeError("dob");
                      }}
                      maxDate={dayjs(
                        new Date(+new Date() - 410200000000 - 86400000)
                      )}
                      minDate={dayjs(new Date(+new Date() - 3156000000000))}
                      modalViewTo={"day"}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            </CardContent>
            <CardActions>
              <button className="btn_default mr-2" onClick={validateData}>
                <Loading loading={updateLoading} width={18} /> Update
              </button>{" "}
            </CardActions>
            {/* </> */}
            {/* )} */}
          </Card>
          {UploadPictureModal()}
        </div>
      </LayoutProvider>
    </>
  );
}

export default Profile;
