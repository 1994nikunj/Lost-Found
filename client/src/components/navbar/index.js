import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import SVGComponent from "components/common/Logo";
import "./styles.css";
import { Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "redux/reducer";

const pages = [
  { name: "Home", route: "/" },
  { name: "Report Item", route: "/report-item" },
];
const settings = [
  { name: "My Profile", route: "/profile", Icon: AccountCircleIcon },
  { name: "My Activites", route: "/My-Activites", Icon: ScatterPlotIcon },
];

function Nav() {
  const dispatch = useDispatch()
  const state = useSelector((state) => state?.userData?.userData);
  const signOutUser = async () => {
    dispatch(setLogin({data: {}}))
  };

  const { pathname } = window.location;

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        zIndex: 999,
        backgroundColor: "#1c2536",
        height: "80px",
        boxShadow: "0px 0px 4px 2px #1c2536",
        placeContent: "center",
      }}
    >
      <Container maxWidth="2xl" disableGutters sx={{ padding: "0px 10px" }}>
        <Toolbar disableGutters>
          <div className="xs:hidden sm:hidden md:flex">
            <SVGComponent fillColor="#fff" w="200" h="55" />
          </div>
          {/* {Phone} */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              alignItems: "center",
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{
                marginLeft: "0px",
                padding: "12px 12px 12px 0px",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ name, route }) => (
                <Link to={route}>
                  <MenuItem key={name} onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      sx={{
                        fontWeight: 600,
                        color: pathname === route ? "#1c2536" : "#868b91",
                        textTransform: "capitalize",
                        fontSize: "1.3rem",
                      }}
                    >
                      {name}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>

            <SVGComponent fillColor="#fff" w="142" h="40" />
          </Box>

          {/* desktop */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              marginLeft: "40px",
            }}
          >
            {pages.map(({ name, route }) => (
              <Link to={route}>
                <Button
                  key={name}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    display: "block",
                    padding: "2px 10px",
                    marginRight: "10px",
                    "&.MuiButtonBase-root:hover": {
                      backgroundColor: "#ffffff10",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <Typography
                    textAlign="center"
                    sx={{
                      // '&.MuiTypography-root:hover': {
                      //   transform: 'scale(1.1)'
                      // },
                      color: pathname === route ? "#fff" : "#9da4ae",
                      textTransform: "capitalize",
                      fontWeight: pathname === route ? "600" : 500,
                      // fontSize: pathname === route ? '1.3rem':"1.2rem",
                      fontSize: "1.3rem",
                    }}
                  >
                    {name}
                  </Typography>
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, border: "1px solid #fff" }}
              >
                <Avatar
                  alt="user_profile"
                  src={state?.image_url}
                  sx={{ borderRadius: "100px", border: "1px solid #1c2536" }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map(({ name, route, Icon }) => (
                <MenuItem key={name} onClick={handleCloseUserMenu}>
                  <Link to={route}>
                    <Typography
                      textAlign="center"
                      sx={{
                        bg: "#9da4ae",
                        color: pathname === route ? "#1c2536" : "#45494e",
                        textTransform: "capitalize",
                        fontWeight: pathname === route ? "600" : 500,
                      }}
                    >
                      <Icon />
                      &nbsp;{name}
                    </Typography>
                  </Link>
                </MenuItem>
              ))}

              <Divider />
              <MenuItem key={"sign-out"} onClick={signOutUser}>
                <Typography
                  textAlign="center"
                  sx={{
                    color: "#0058ff",
                    textTransform: "capitalize",
                    fontWeight: 700,
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ExitToAppIcon />
                  &nbsp;Sign Out
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    // <div className="max-w-[280px] flex flex-col justify-between pl-2 pr-4 pt-8 pb-2 text-[#ffffff] border-r-logoBlue border-r-2 col-span-2 bg-logoBlue">
    //   <div>
    //     <div className="h-20 pl-4 flex items-center text-ellipsis overflow-hidden whitespace-nowrap">
    //       {/* <img src={HomepageLogo} alt="HomepageLogo" /> */}
    //       <svg
    //         style={{ margin: "0px -25px -15px" }}
    //         viewBox="0 0 500 500"
    //         version="1.1"
    //         id="svg_null"
    //         width={100}
    //         height={100}
    //       >
    //         <defs>
    //           <linearGradient
    //             x1="50%"
    //             y1="25.963%"
    //             x2="50%"
    //             y2="100%"
    //             id="linearGradient-1"
    //           >
    //             <stop stopColor="#FEFEFE" offset="0%" />
    //             <stop stopColor="#D2D4D5" offset="100%" />
    //           </linearGradient>
    //           <linearGradient
    //             x1="50%"
    //             y1="0%"
    //             x2="50%"
    //             y2="100%"
    //             id="linearGradient-2"
    //           >
    //             <stop stopColor="#D4D5D6" offset="0%" />
    //             <stop stopColor="#FAFBFB" offset="100%" />
    //           </linearGradient>
    //           <linearGradient
    //             x1="71.7%"
    //             y1="37.738%"
    //             x2="0%"
    //             y2="100%"
    //             id="linearGradient-3"
    //           >
    //             <stop stopColor="#FEFEFE" offset="0%" />
    //             <stop stopColor="#D2D4D5" offset="100%" />
    //           </linearGradient>
    //           <linearGradient
    //             x1="112.505%"
    //             y1="100%"
    //             x2="25.798%"
    //             y2="100%"
    //             id="linearGradient-4"
    //           >
    //             <stop stopColor="#FDFDFD" offset="0%" />
    //             <stop stopColor="#D5D7D8" offset="100%" />
    //           </linearGradient>
    //         </defs>
    //         <g
    //           id="root"
    //           stroke="none"
    //           strokeWidth="1"
    //           fill="none"
    //           fillRule="evenodd"
    //         >
    //           <rect
    //             id="background.accent"
    //             fill=""
    //             x="0"
    //             y="0"
    //             width="500"
    //             height="500"
    //           />
    //           <g id="shape" transform="translate(150.000000, 99.000000)">
    //             <polygon
    //               fill="url(#linearGradient-1)"
    //               points="158.821 19.769 40.206 19.769 40.206 39.538 178.59 39.538 178.59 197.692 198.359 177.923 198.359 19.769"
    //             />
    //             <polygon
    //               fill="url(#linearGradient-2)"
    //               points="158.821 39.538 158.821 177.923 .667 177.923 20.436 197.692 139.052 197.692 178.59 197.692 178.59 158.154 178.59 39.538"
    //             />
    //             <polygon
    //               fill="url(#linearGradient-3)"
    //               points="20.436 0 .667 19.769 .667 138.384 .667 177.923 40.206 177.923 158.821 177.923 158.821 158.154 20.436 158.154"
    //             />
    //             <polygon
    //               fill="url(#linearGradient-4)"
    //               points="20.436 0 20.436 39.538 20.436 158.154 40.206 158.154 40.206 19.769 198.359 19.769 178.59 0"
    //             />
    //             <polygon
    //               fill="#C8C8C8"
    //               points="158.821 47.226 178.59 47.226 178.59 39.538 158.821 39.538"
    //             />
    //           </g>
    //         </g>
    //       </svg>
    //       <span className="text-3xl flex items-center"> UInvite</span>
    //     </div>

    //     <div>
    //       {navOptions.map((item, key) => (
    //         <div
    //           key={key}
    //           className="cursor-pointer flex items-center w-full group pl-4 pr-6 py-4 my-2 text-ellipsis overflow-hidden whitespace-nowrap rounded-full hover:bg-[#0000001f] hover:border-1 hover:shadow-[#000] hover:font-medium"
    //           onClick={() => navigate(item?.path)}
    //         >
    //           <div className="group-hover:scale-110">
    //             <item.icon />
    //           </div>
    //           <span className="ml-2 text-lg">{item.name}</span>
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    //   <div>
    //     <Divider />
    //     <div
    //       className="flex items-center group w-full pl-4 pr-6 py-4 my-3 text-ellipsis overflow-hidden whitespace-nowrap rounded-full hover:bg-[#0000001f] hover:border-1 hover:shadow-[#000] hover:font-medium cursor-pointer"
    //       onClick={signOutUser}
    //     >
    //       <div className="group-hover:scale-110">
    //         <LogoutIcon />
    //       </div>
    //       <span className="ml-2 sm:invisible md:visible">Sign out</span>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Nav;
