from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import *
from .forms import *

def home(request):
    return render(request, 'home.html')

def dashboard(request):
    return render(request, 'dashboard.html')



def login_page(request):
    page = 'login'
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = User.objects.get(email=email)
            if user.is_active == False:
              
              messages.info(request, "Your accout has been deactivated by administrator. Request to activate")

        except:
            messages.error(request, 'User does not exist')  

        user = authenticate(request, email=email, password=password)

       
        if user is not None:
            login(request, user)
            return redirect('home') 
        else:
            messages.error(request, 'Username or password is not correct') 

    context = {'page': page}
    return render(request, 'login_register.html', context)

def logout_page(request):
    logout(request)
    return redirect('home')


def register_page(request):
    form = MyUserCreationForm()

    if request.method == 'POST':
        form = MyUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            login(request, user)
            return redirect('login')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f"{field}: {error}")
            return redirect('signup')

    return render(request, 'login_register.html', {'form': form})
