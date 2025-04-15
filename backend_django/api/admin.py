from django.contrib import admin # type: ignore
from .models import User, DownloadHistory, ConversionHistory, ServerLog
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin # type: ignore

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'username', 'is_staff')

admin.site.register(DownloadHistory)
admin.site.register(ConversionHistory)
admin.site.register(ServerLog)
