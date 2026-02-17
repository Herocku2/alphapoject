from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import GeneralSettings, CustomPercentageGroup

User = get_user_model()

admin.site.register(GeneralSettings)


# Unregister the default User admin and register a custom one with search enabled


@admin.register(CustomPercentageGroup)
class CustomPercentageGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'percentage', 'is_active', 'user_count', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name',)
    filter_horizontal = ('users',)  # Two-column widget with search
    
    fieldsets = (
        ('Group Information', {
            'fields': ('name', 'percentage', 'is_active')
        }),
        ('Users', {
            'fields': ('users',),
            'description': 'Select users who will receive this custom percentage. Use the search box to find users.'
        }),
    )
    
    def user_count(self, obj):
        """Display the number of users in the group"""
        return obj.users.count()
    user_count.short_description = 'Number of users'
    
    readonly_fields = ('created_at', 'updated_at')