from rest_framework.views import APIView
from .models import UnilevelTree, Referr
from apps.core.models import GeneralSettings
from rest_framework.response import Response
from apps.investment_plans.models import UserInvestment
from rest_framework import status
from rest_framework.viewsets import ReadOnlyModelViewSet
from .serializers import ReferrSerializer
from apps.core.paginators import BasicPaginationResponse
from rest_framework.decorators import action
from django.utils.translation import gettext_lazy as _

class GetReferrals(ReadOnlyModelViewSet):
    
    serializer_class = ReferrSerializer
    pagination_class = BasicPaginationResponse
    
    
    def get_queryset(self):
        return Referr.objects.filter(user=self.request.user).order_by("-date")
    
    
    @action(url_path='activate-master-code', methods=['POST'], detail=True)
    def activate_master_code(self, request, *args, **kwargs):
        referr_obj: Referr = self.get_object()
        current_referres = Referr.objects.filter(user=request.user, is_master_code=True)
        if current_referres.count() < 100 and request.user.is_fundator:
            referr_obj.is_master_code = True
            referr_obj.save()
            return Response(data={"message": _("Referral master code activated!")}, status=status.HTTP_200_OK)
        else:
            return Response(data={"message": _("You dont have permissions to activate master codes!")}, status=status.HTTP_403_FORBIDDEN)
    

class GetUnilevelTree(APIView):
    
    def get(self, request, *args, **kwargs):
        user_loggin = request.user
        if request.user.is_authenticated:
            user_tree = UnilevelTree.objects.filter(user=user_loggin).first()
            get_descendents = user_tree.get_annotated_list(parent=user_tree)
            children = get_descendents
            default_user_avatar = GeneralSettings.objects.last().default_user_avatar
            default_user_avatar_url = ""
            if default_user_avatar:
                default_user_avatar_url = default_user_avatar.url
            json_info = []
            counter = 0
            for child in children:
                user_node = child[0]
                username = user_node.user.username
                id_node = user_node.id
                parent_id = None
                user_node_parent = user_node.get_parent()
                if user_node_parent:
                    parent_id = user_node_parent.id
                if user_node.user:
                    full_name = str(user_node.user.get_full_name())[:22]
                    if user_node.user.avatar:
                        avatar = request.build_absolute_uri(user_node.user.avatar.url)
                    else:
                        avatar = request.build_absolute_uri(default_user_avatar_url)
                    user_investment = UserInvestment.objects.filter(user=user_node.user, status=True).last()
                    is_master_code = Referr.objects.filter(referred=user_node.user, is_master_code=True).exists()
                        
                    if user_investment:
                        plan_name = str(round(user_investment.total_investment_amount, 2))
                    else:
                        plan_name = '0 '
                    flag = True if user_node.user != user_loggin else False
                    
                    if user_node_parent:
                        children = user_node_parent.get_children()
                    
                    if parent_id and flag:
                        json_ = {'id':str('O-'+str(id_node)), 'username':username, 'name':full_name, 'imageUrl':avatar, 'parentId':str('O-'+str(parent_id)), 
                                'plan_name':plan_name, "is_master_code": is_master_code}
                    else:
                        json_ = {'id':str('O-'+str(id_node)), 'username':username, 'name':full_name, 'imageUrl':avatar,'parentId':'',
                                'plan_name':plan_name,"is_master_code": is_master_code}
                    
                    json_info.append(json_)
                        
                
                    
                    counter += 1
                
            return Response(json_info, status=status.HTTP_200_OK)
        else:
            return Response({"message": "anonymous user"}, status=status.HTTP_403_FORBIDDEN)

