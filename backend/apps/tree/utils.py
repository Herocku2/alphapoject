from .models import UnilevelTree, Referr

def insert_user(user):
    partner = Referr.objects.get(referred=user)
    user_tree =UnilevelTree.objects.get(user=partner.user)
    user_tree.add_child(user=user)
    return True

