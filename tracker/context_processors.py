def navbar_data(request):
    homepage_dict = dict(name="Main Page", icon="bi-house", url="/")
    navbar_from_request_origin = {
        "/": dict(name="Portfolio", icon="bi-wallet2", url="/portfolio"),
        '/portfolio/': homepage_dict,
        "/login/": homepage_dict,
        "/register/": homepage_dict,
    }
    ret = navbar_from_request_origin.get(request.path, dict(name="Error", icon="", url=""))
    # print("returning", ret)
    return dict(nav=ret)
