<?php

//CALLBACK
$json = file_get_contents("php://input");/* Permet de recuperer la reponse json envoyée vers le fichier */

$data = json_decode($json); // decode la response json sous form d'array

$code = $data->code; // statut de la transaction
$message = $data->message; //le message du statut de la transaction FlexPaie
$amount = $data->amount; //le montant de la transaction FlexPaie
$currency = $data->currency; //la Devise de la transaction FlexPaie
$createdAt = $data->createdAt; //date de la transaction FlexPaie
$status = $data->status; //statut de la transaction FlexPaie dont 0 = Succes
$channel = $data->channel; //canal de paiement (opérateur) utilisé pour lors du paiement sur FlexPaie

/* Si code est '0' le paiement est fais avec succès 
 * sinon il n'a pas aboutis
 */