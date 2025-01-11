def navbar_data(request):
    navbar_from_request_origin = {
        "/": dict(name="Portfolio", icon="bi-wallet2", url="/portfolio"),
        '/portfolio/': dict(name="Main Page", icon="bi-house", url="/"),
    }
    ret = navbar_from_request_origin.get(request.path, dict(name="Error", icon="", url=""))
    # print("returning", ret)
    return dict(nav=ret)
