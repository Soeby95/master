const SDK = {
    serverURL: "http://dis-bookstore.herokuapp.com/api",
    request: (options, cb) => {
        $.ajax({
            url: SDK.serverURL + options.url,
            method: options.method,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(options.data),
            success: (data, status, xhr) => {
                cb(null, data, status, xhr);
            },
            error: (xhr, status, errorThrown) => {
                cb({xhr: xhr, status: status, error: errorThrown});
            }
        });

    },


Users: {
    findAll: (cb) => {
        SDK.request({method: "GET", url: "/users"}, cb);
    },
    current: () => {
        return SDK.Storage.load("users");
    },
    logOut: () => {
        SDK.Storage.remove("tokenId");
        SDK.Storage.remove("userId");
        SDK.Storage.remove("user");
        window.location.href = "index.html";
    },
    login: (email, password, cb) => {
        SDK.request({
            data: {
                email: email,
                password: password
            },
            url: "/users/login?include=user",
            method: "POST"
        }, (err, data) => {

            //On login-error
            if (err) return cb(err);

        SDK.Storage.persist("tokenId", data.id);
        SDK.Storage.persist("userId", data.userId);
        SDK.Storage.persist("user", data.user);

        cb(null, data);

    });
    },
    loadNav: (cb) => {
        $("#nav-container").load("nav.html", () => {
            const currentUser = SDK.User.current();
        if (currentUser) {
            $(".navbar-right").html(`
            <li><a href="my-page.html">Your orders</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
          `);
        } else {
            $(".navbar-right").html(`
            <li><a href="login.html">Log-in <span class="sr-only">(current)</span></a></li>
          `);
        }
        $("#logout-link").click(() => SDK.User.logOut());
        cb && cb();
    });
    }