from rest_framework.response import Response
from rest_framework.decorators import api_view
# from django.shortcuts import render

@api_view(['GET'])
def index(request):
    # return render(request, 'index.html')
    return Response({
        'message': 'WELCOME',
    })