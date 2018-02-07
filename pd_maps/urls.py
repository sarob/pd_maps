"""pd_maps_temp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^maps/',views.get_maps, name='get_maps'),
    url(r'^charts/(?P<name>[a-zA-Z%0-9\-_. ]+)/$',views.get_charts, name='render_charts'),
    url(r'^get_entities/',views.get_entities, name='get_entities'),
    # url(r'^plot/(?P<name>[a-zA-Z%0-9\-_. ]+)$', views.plot, name='plot'),
]
