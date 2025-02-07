<?php
session_start();
require_once('bdd/db.php');
$_SESSION['transaction']='PD8eCOf11gM51094hvR21rqw';

if(empty($_SESSION['transaction']) || !isset($_SESSION['transaction'])){header('location:index.php');}
      //v�rifier chez l'op�rateur BC MONEY
$orderNumber=$_SESSION['transaction']; 
    $data = array(

       "merchant" => "BUKINEURS",
       "type" => "1",
       "phone"=>$_SESSION['session_telephone'],
       "reference" => "MM0000159",

       "currency" =>  "CDF",
       "callbackUrl" => "https://abcd.efgh.cd/",

      );
$data = json_encode($data);
$gateway = "https://backend.flexpay.cd/api/rest/v1/check/$orderNumber";
$type='GET';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $gateway);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $type);
curl_setopt($ch, CURLOPT_HTTPHEADER, Array("Content-Type: application/json","Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJcL2xvZ2luIiwicm9sZXMiOlsiTUVSQ0hBTlQiXSwiZXhwIjoxNzAyNDcyNzMwLCJzdWIiOiI1OTExODVjNWUzY2UxZmNjYmUzMzFlNzhjMDFmMDY4YyJ9.YsrIWxcYBHzjvCNBgb62FmNaZcLBZtjAZOvCzXVIPOY")); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 300);
$response = curl_exec($ch);
 $jsonRes = json_decode($response);

 curl_close($ch);
$verification = $jsonRes->transaction->status;


        if($verification=='0')
        {
             $reqs=$bdd->prepare("UPDATE paie_delibe SET etat=1 WHERE  transactionid=?");
          $reqs->execute([$_SESSION['transaction']]);

          $re=$bdd->prepare("UPDATE benefice SET etat=1 WHERE  transactionid=?");
          $re->execute([$_SESSION['transaction']]);
       
      header('location:print/coupon3.php');
         
        }
        else{
          header('location:print/coupon3.php');
        }
require_once('include/headerPublic.php'); 
?>



    <!-- ======= Breadcrumbs ======= -->
    <section id="breadcrumbs" class="breadcrumbs">
      <div class="container">
        <h2>Attente du Paiement</h2>
      </div>
    </section><!-- End Breadcrumbs -->

    <section class="inner-page">
      <div class="container">
        <div class="row gy-4">
          <div class="col-lg-2">
          </div>
          <div class="col-lg-8">
            <div class="col-lg-12 ">
            <div class="alert alert-danger"> Merci de confirmer votre paiment...<img src="assets/img/spinner.gif" style="height: 70px; width: 70px; "></i></div>
            </div>

          </div>

          <div class="col-lg-2">
          </div>

        </div>
      </div>
    </section>


  <script type="text/javascript">
    
  setInterval("window.location.reload()", 10000);
</script>


<?php
require_once('include/footerPublic.php'); 
?> 