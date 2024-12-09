import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link } from "@tanstack/react-router";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import { ModeToggle } from "./ui/mode-toggle";

export const Header = () => {
  const navigationItems = [
    {
      title: "Home",
      href: "/",
      description: "",
    },
    {
      title: "Dashboard",
      href: "/",
      description: "",
    },
    {
      title: "Medical Services",
      description: "Managing a small business today is already tough.",
      items: [
        {
          title: "Appointments",
          href: "/404",
        },
        {
          title: "Book Specialist Doctors",
          href: "/statistics",
        },
        {
          title: "Book Specialist Hospital",
          href: "/dashboards",
        },
        {
          title: "Recordings",
          href: "/recordings",
        },
      ],
    },
    {
      title: "About",
      description: "Managing a small business today is already tough.",
      items: [
        {
          title: "About us",
          href: "/about",
        },
        {
          title: "FAQ",
          href: "/fundraising",
        },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(false);
  return (
    <header className="w-full z-40 fixed top-0 rounded-b-2xl left-0 bg-background">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
        <Link to="/">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 735.000000 648.000000"
              className="w-20 h-20 text-white p-2 "
              preserveAspectRatio="xMidYMid meet"
            >
              <g
                transform="translate(0.000000,648.000000) scale(0.100000,-0.100000)"
                fill="#000000"
                stroke="none"
              >
                <path
                  d="M3390 6243 c-96 -9 -317 -48 -416 -73 -432 -111 -869 -374 -1156
-695 -91 -101 -222 -274 -288 -380 -68 -109 -170 -312 -170 -337 0 -23 114
-178 130 -178 5 0 18 28 29 63 55 163 232 456 377 622 159 181 290 296 489
428 291 192 611 306 977 346 169 19 444 9 575 -20 45 -10 56 -10 90 7 30 15
60 19 143 19 95 0 111 -3 168 -29 44 -20 80 -48 122 -93 33 -35 60 -68 60 -73
0 -6 41 -30 91 -56 188 -94 366 -226 551 -405 64 -63 138 -134 165 -159 29
-27 61 -71 81 -110 17 -36 61 -116 96 -179 296 -521 362 -1149 183 -1740 -19
-61 -37 -114 -40 -118 -4 -3 -111 -21 -239 -39 -197 -29 -558 -90 -564 -97 -1
-1 -21 -45 -45 -97 -151 -338 -388 -587 -719 -759 -100 -52 -281 -131 -299
-131 -3 0 21 17 55 38 109 67 254 174 342 253 221 196 401 471 504 769 31 90
33 103 33 235 0 157 -10 205 -61 305 -47 91 -106 155 -192 212 -82 53 -175 86
-268 95 -71 7 -199 -17 -286 -52 -32 -12 -58 -21 -58 -20 0 1 20 38 45 81 46
80 135 281 135 304 0 7 -13 -5 -29 -27 -117 -161 -339 -338 -576 -458 -492
-250 -1137 -305 -1633 -139 -191 64 -407 187 -537 305 l-58 54 7 -144 c9 -168
7 -165 131 -273 291 -254 629 -378 1032 -378 361 0 609 67 1073 290 250 121
348 152 480 153 165 1 270 -36 374 -133 37 -35 78 -82 92 -105 132 -226 83
-558 -132 -880 -56 -84 -194 -240 -279 -316 -46 -41 -45 -39 22 40 52 62 88
119 141 225 67 135 109 242 99 252 -2 3 -58 -14 -123 -37 -196 -68 -499 -167
-664 -215 -85 -25 -190 -57 -232 -71 -43 -13 -80 -24 -83 -24 -3 1 -40 -28
-83 -65 -104 -89 -193 -147 -340 -221 -186 -94 -199 -96 -301 -36 l-43 25 88
43 c375 179 671 451 967 892 73 109 213 370 204 379 -2 3 -47 -21 -98 -52 -52
-32 -149 -83 -217 -115 l-123 -57 -52 -104 c-102 -203 -256 -406 -487 -639
-190 -193 -382 -316 -533 -344 -49 -9 -44 -15 99 -111 253 -168 580 -304 873
-364 314 -63 758 -61 1046 6 594 138 1038 427 1392 904 223 302 375 682 434
1087 19 129 21 178 16 388 -5 256 -14 330 -67 535 -110 424 -302 770 -594
1069 -141 144 -236 223 -399 331 -257 172 -542 292 -828 350 -203 41 -510 60
-699 43z"
                />
                <path
                  d="M4107 5870 c-160 -48 -186 -286 -42 -375 130 -80 308 4 323 153 4 51
-20 125 -56 166 -45 50 -153 77 -225 56z"
                />
                <path
                  d="M3330 5509 c-143 -16 -341 -94 -465 -183 -125 -90 -336 -330 -402
-457 -52 -99 -29 -183 46 -177 34 3 38 8 75 81 82 162 239 309 430 402 171 83
241 100 421 100 126 0 163 -4 230 -23 102 -29 262 -107 342 -165 146 -108 263
-314 263 -465 l0 -39 78 -35 c172 -79 333 -74 508 15 180 91 408 375 391 484
-8 46 -33 73 -69 73 -48 0 -68 -18 -103 -93 -61 -134 -192 -231 -331 -245
-210 -22 -354 63 -527 309 -113 160 -220 256 -372 332 -100 50 -186 75 -295
87 -106 11 -115 11 -220 -1z"
                />
                <path
                  d="M3830 4918 c-53 -304 -317 -623 -655 -791 -405 -202 -948 -203 -1372
-2 -157 74 -331 201 -451 330 -35 37 -65 65 -67 64 -5 -6 -43 -216 -55 -304
l-10 -80 68 -63 c140 -133 373 -267 572 -331 189 -62 343 -83 594 -82 328 2
601 62 883 196 206 98 357 209 531 390 115 119 193 230 218 309 15 48 15 57 0
114 -27 106 -63 166 -148 247 -43 41 -82 75 -86 75 -5 0 -15 -33 -22 -72z"
                />
                <path
                  d="M1243 3345 c3 -11 18 -65 33 -120 61 -231 181 -494 319 -701 107
-159 180 -250 304 -377 92 -94 97 -98 131 -92 91 17 256 115 364 215 105 98
106 96 -44 92 -71 -2 -151 1 -179 7 -90 19 -209 71 -272 118 -56 42 -184 181
-175 190 2 3 35 -11 72 -30 160 -80 314 -117 488 -117 200 0 332 54 466 189
84 85 155 181 184 252 l15 36 -87 -22 c-273 -71 -675 -73 -951 -4 -217 54
-448 177 -605 320 -42 39 -66 56 -63 44z"
                />
                <path
                  d="M2025 639 c-124 -36 -142 -210 -28 -267 21 -11 62 -25 92 -32 91 -21
114 -67 46 -90 -37 -12 -89 -6 -149 16 -38 15 -41 15 -58 -8 -10 -13 -17 -30
-15 -38 4 -24 64 -58 125 -71 168 -35 303 82 248 216 -19 44 -50 63 -143 89
-81 23 -106 43 -87 73 16 26 84 28 139 4 l45 -20 26 39 c14 21 23 43 20 49 -4
5 -31 19 -62 30 -57 22 -145 26 -199 10z"
                />
                <path
                  d="M2883 636 c-121 -38 -191 -139 -181 -260 8 -91 57 -164 142 -209 55
-29 184 -31 236 -3 58 30 109 86 130 143 24 64 25 102 5 170 -39 131 -190 203
-332 159z m154 -116 c48 -29 67 -65 67 -125 0 -60 -19 -96 -67 -125 -65 -40
-155 -16 -198 52 -39 63 -14 161 51 202 35 22 108 20 147 -4z"
                />
                <path
                  d="M340 396 l0 -246 61 0 61 0 -4 59 -3 59 68 6 c72 7 111 22 138 52 56
64 67 173 24 237 -41 60 -72 71 -217 75 l-128 4 0 -246z m214 124 c50 -19 58
-78 16 -120 -14 -14 -34 -20 -65 -20 l-45 0 0 75 0 75 34 0 c19 0 46 -4 60
-10z"
                />
                <path
                  d="M840 395 l0 -245 55 0 55 0 0 95 0 95 105 0 105 0 0 -95 0 -96 58 3
57 3 0 240 0 240 -57 3 -58 3 0 -96 0 -95 -105 0 -105 0 0 95 0 95 -55 0 -55
0 0 -245z"
                />
                <path
                  d="M1406 608 c9 -18 31 -55 49 -83 17 -27 48 -80 68 -116 36 -63 37 -70
37 -162 l0 -97 60 0 60 0 0 93 0 94 84 131 c123 191 119 172 39 172 l-68 0
-49 -80 c-27 -44 -52 -83 -56 -85 -5 -3 -28 32 -53 77 l-44 83 -72 3 -72 3 17
-33z"
                />
                <path d="M2430 395 l0 -245 55 0 55 0 0 245 0 245 -55 0 -55 0 0 -245z" />
                <path
                  d="M3511 627 c-18 -7 -51 -28 -72 -46 -136 -113 -105 -332 56 -407 86
-41 218 -25 264 30 13 15 12 20 -7 38 -20 20 -22 20 -46 5 -38 -25 -100 -36
-147 -26 -113 26 -169 146 -120 255 22 47 59 77 117 93 47 13 120 2 158 -23
24 -15 26 -15 46 14 l21 29 -43 22 c-52 27 -175 35 -227 16z"
                />
                <path
                  d="M4015 621 c-135 -61 -185 -204 -120 -337 46 -95 130 -140 242 -131
163 13 262 166 209 324 -19 57 -82 124 -138 148 -51 21 -143 19 -193 -4z m184
-66 c64 -33 109 -122 98 -193 -15 -87 -85 -142 -183 -142 -71 0 -119 23 -152
72 -57 86 -31 207 54 255 47 27 140 31 183 8z"
                />
                <path
                  d="M4500 395 l0 -245 30 0 30 0 2 186 3 185 59 -73 c208 -255 248 -298
277 -298 l29 0 0 245 0 245 -30 0 -30 0 -2 -192 -3 -193 -160 193 c-122 147
-165 192 -182 192 l-23 0 0 -245z"
                />
                <path
                  d="M5100 395 l0 -245 30 0 30 0 2 187 3 187 95 -114 c52 -63 121 -148
153 -188 48 -60 62 -72 87 -72 l30 0 0 245 0 245 -30 0 -30 0 0 -191 c0 -160
-2 -190 -14 -180 -7 6 -78 92 -157 191 -124 155 -148 180 -171 180 l-28 0 0
-245z"
                />
                <path
                  d="M5700 394 l0 -246 153 3 c83 1 158 5 165 7 6 2 12 17 12 33 l0 29
-130 0 -130 0 0 70 0 70 110 0 110 0 0 30 0 30 -115 0 -115 0 0 75 0 75 136 0
135 0 -3 33 -3 32 -162 3 -163 2 0 -246z"
                />
                <path
                  d="M6280 620 c-98 -46 -144 -118 -145 -225 0 -58 4 -78 27 -116 35 -59
87 -105 135 -118 86 -24 183 -7 248 42 20 15 20 16 -4 41 l-24 25 -31 -22
c-46 -33 -148 -35 -201 -5 -81 47 -110 159 -62 242 35 63 67 80 152 84 63 4
80 1 110 -18 l35 -22 20 24 c11 12 19 26 20 30 0 4 -19 17 -42 29 -63 33 -178
37 -238 9z"
                />
                <path
                  d="M6630 605 l0 -35 70 0 70 0 0 -210 0 -210 35 0 35 0 0 210 0 210 70
0 70 0 0 35 0 35 -175 0 -175 0 0 -35z"
                />
              </g>
            </svg>

            <span className="ml-3 text-xm"></span>
          </a>
        </Link>

        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-start items-start">
            <NavigationMenuList className="flex justify-start gap-4 flex-row">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <NavigationMenuLink asChild>
                      <Link to={item.href}>
                        <Button variant="ghost">{item.title}</Button>
                      </Link>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-sm">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                          <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col">
                              <p className="text-base">{item.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            <Button size="sm" className="mt-10">
                              Book a call today
                            </Button>
                          </div>
                          <div className="flex flex-col text-sm h-full justify-end">
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink
                                href={subItem.href}
                                key={subItem.title}
                                className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
                              >
                                <span>{subItem.title}</span>
                                <MoveRight className="w-4 h-4 text-muted-foreground" />
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex justify-end w-full gap-4">
          <Link to="/login">
            <Button variant="outline">Sign in</Button>
          </Link>
          <Link to="/signup/user">
            <Button>Register</Button>
          </Link>
          <ModeToggle />
        </div>
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {isOpen && (
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex justify-between items-center"
                      >
                        <span className="text-lg">{item.title}</span>
                        <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                      </Link>
                    ) : (
                      <p className="text-lg">{item.title}</p>
                    )}
                    {item.items &&
                      item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="flex justify-between items-center"
                        >
                          <span className="text-muted-foreground">
                            {subItem.title}
                          </span>
                          <MoveRight className="w-4 h-4 stroke-1" />
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
