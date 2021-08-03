This software is Copyright © 2021 The Regents of the University of California. All Rights Reserved.

Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice, this paragraph and the following three paragraphs appear in all copies.

Permission to make commercial use of this software may be obtained by contacting:
Technology Transfer Office
9500 Gilman Drive, Mail Code 0910
University of California
La Jolla, CA 92093-0910
(858) 534-5815
invent@ucsd.edu

This software program and documentation are copyrighted by The Regents of the University of California. The software program and documentation are supplied "as is", without any accompanying services from The Regents. The Regents does not warrant that the operation of the program will be uninterrupted or error-free. The end-user understands that the program was developed for research purposes and is advised not to rely exclusively on the program for any reason.


IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS IS" BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.

# TVCV19

![](landing/Splash.png) 

**MedECC** is an opensource telemedicine app to allow clinicians to better scale personnel resources.
Although hardware can be mass produced, clinician knowledge and experience cannot and this needs to be scaled out somehow.
Our platform aims to organize the heterogeneous hardware and manpower resources into a patient monitoring and decision making hierarchy.

If 10 COVID patients suddenly show up at a hospital with breathing difficulty, a misjudgement by the physician on who needs immediate intervention can be deadly. Our app allows caregivers to safely ration complex medical care to those who need it the most in order to save the most amount of lives.

This is how it works:

Traditionally, a bedside provider has to contact the physician via pager, a physician would then come to assess the patient at bedside, then put in orders before he/she can move onto the next patient.

The app provides instant access to a patient. A video feed along with real time patient data can be used by the supervising provider to assess a patient's condition. Once a decision is made, on the spot instructions can be given, or the supervisor can come prepared for a bedside procedure. This also means less exposure for doctors to infected patients, and less likely they’ll fall sick.

In cases where the supervising physician is overwhelmed or needs more complex help, the app allows quickly passing a patient to a specialist and ensures that cases are vetted before necessitating specialist attention.

You can learn more by browsing our [concept slides](https://docs.google.com/presentation/d/1jx_JJByAbFSXHXhZfbF9ar7q-Zx0MacvegpB00uDiNY/edit?usp=sharing) and listening to the accompanying [audio](https://www.uberconference.com/getmp3/AMIfv96b4tICKo7poclDD1wA3ljoQGVjX5lJ87UGyMusDsqpWrA9_SicAiTtTIgBCxpy7tUZsg8eZMD__9GbqGigc21ryxLr58KPmLOuIUcWgVltLQEmKRbjEPGKtYLqD_cy1Fx86Uls0aoCrx9p41Y52YWyEJF-Uw.mp3).

We are currently racing against the global novel coronavirus pandemic and could use a hand. 

If you want to contribute to the project, please fill out this [online form](https://docs.google.com/forms/d/e/1FAIpQLSf2osgKSobmYf0kSwzRrotV2hk5i8TjtZZdn5XptA1UjeIXVA/viewform)  and join our [slack channel](https://join.slack.com/t/scalablecv19solutions/shared_invite/zt-cxcbnbyu-yu4dxzaMjjnQvBGkQYVkxw) (#tv-cv19).

## How to Run
**Note:** If you have an old database created from the DB scripts, be sure to drop the DB before continuing.

### Setup the database for development
We use mySQL for our backend database.  The development instance uses a predetermined password.

To setup the database follow these steps:
1. Execute `ALTER USER 'root'@'localhost' IDENTIFIED BY 'Password1'` in mySQL
1. Execute `dotnet tool install --global dotnet-ef` to install the tools for Entity Framework.
1. Execute `dotnet ef database update` to create the database.

### Before running the C# Code
1. Navigate to `./frontend/TvCv19.Frontend/ClientApp`
1. Execute `npm install`
1. Execute `ng serve`.  **Note: You must be running `ng serve` for the ASP.Net Core web app to be able to display the website.**

### Run the C# Code
1. Launch `./frontend/TvCv19.Frontend.sln`
1. Run the app

## Add New Migrations
After updating the models or the `MedeccContext`, it is necessary to create a new DB migration.  To do so, execute `dotnet ef migrations add <migration name>`.
