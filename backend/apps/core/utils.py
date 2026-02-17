from django.conf import settings

def get_media_file_url(file):
    if settings.DEBUG:
        return settings.BACKEND_DOMAIN + file
    else:
        return "https://" + settings.BACKEND_DOMAIN + file

    