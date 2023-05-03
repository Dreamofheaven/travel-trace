from rest_framework import response
from rest_framework.decorators import api_view

@api_view(['GET'])
def index(request):
    return response({
        'message': 'WELCOME',
    })